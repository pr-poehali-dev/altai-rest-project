'''
Business: Handle room booking requests - create, retrieve, and check availability
Args: event with httpMethod, body (POST: guest info, dates), queryStringParameters (GET: room_id, date)
Returns: HTTP response with booking confirmation or availability data
'''

import json
import os
from datetime import datetime, date
from typing import Dict, Any, List, Optional
import psycopg2
from psycopg2.extras import RealDictCursor

def get_db_connection():
    database_url = os.environ.get('DATABASE_URL')
    return psycopg2.connect(database_url)

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    conn = get_db_connection()
    
    try:
        if method == 'GET':
            params = event.get('queryStringParameters') or {}
            room_id = params.get('room_id')
            
            with conn.cursor(cursor_factory=RealDictCursor) as cur:
                if room_id:
                    cur.execute(
                        "SELECT * FROM bookings WHERE room_id = %s AND status = 'confirmed' ORDER BY check_in_date DESC",
                        (room_id,)
                    )
                else:
                    cur.execute(
                        "SELECT * FROM bookings WHERE status = 'confirmed' ORDER BY created_at DESC LIMIT 50"
                    )
                
                bookings = cur.fetchall()
                
                for booking in bookings:
                    if booking.get('check_in_date'):
                        booking['check_in_date'] = booking['check_in_date'].isoformat()
                    if booking.get('check_out_date'):
                        booking['check_out_date'] = booking['check_out_date'].isoformat()
                    if booking.get('created_at'):
                        booking['created_at'] = booking['created_at'].isoformat()
            
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'bookings': bookings}, ensure_ascii=False),
                'isBase64Encoded': False
            }
        
        if method == 'POST':
            body_data = json.loads(event.get('body', '{}'))
            
            room_id = body_data.get('room_id')
            room_name = body_data.get('room_name')
            guest_name = body_data.get('guest_name')
            guest_phone = body_data.get('guest_phone')
            check_in_date = body_data.get('check_in_date')
            check_out_date = body_data.get('check_out_date')
            guests_count = body_data.get('guests_count', 1)
            comment = body_data.get('comment', '')
            
            if not all([room_id, room_name, guest_name, guest_phone, check_in_date]):
                return {
                    'statusCode': 400,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'body': json.dumps({'error': 'Заполните все обязательные поля'}, ensure_ascii=False),
                    'isBase64Encoded': False
                }
            
            with conn.cursor(cursor_factory=RealDictCursor) as cur:
                cur.execute(
                    """INSERT INTO bookings 
                       (room_id, room_name, guest_name, guest_phone, check_in_date, check_out_date, guests_count, comment, status)
                       VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
                       RETURNING id, created_at""",
                    (room_id, room_name, guest_name, guest_phone, check_in_date, check_out_date, guests_count, comment, 'confirmed')
                )
                result = cur.fetchone()
                conn.commit()
                
                booking_id = result['id']
                created_at = result['created_at'].isoformat()
            
            return {
                'statusCode': 201,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({
                    'success': True,
                    'booking_id': booking_id,
                    'message': 'Бронирование успешно создано!',
                    'created_at': created_at
                }, ensure_ascii=False),
                'isBase64Encoded': False
            }
        
        return {
            'statusCode': 405,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Метод не поддерживается'}, ensure_ascii=False),
            'isBase64Encoded': False
        }
    
    finally:
        conn.close()
