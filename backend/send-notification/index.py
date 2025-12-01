'''
Business: Send email notification to admin about new booking
Args: event with POST body containing booking details (room_name, guest_name, phone, dates)
Returns: Success/error status of email sending
'''

import json
import os
from typing import Dict, Any
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from datetime import datetime

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    method: str = event.get('httpMethod', 'POST')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    smtp_host = os.environ.get('SMTP_HOST')
    smtp_port = int(os.environ.get('SMTP_PORT', '587'))
    smtp_user = os.environ.get('SMTP_USER')
    smtp_password = os.environ.get('SMTP_PASSWORD')
    admin_email = os.environ.get('ADMIN_EMAIL')
    
    if not all([smtp_host, smtp_user, smtp_password, admin_email]):
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({
                'success': True,
                'message': 'Email settings not configured, notification skipped'
            }, ensure_ascii=False),
            'isBase64Encoded': False
        }
    
    body_data = json.loads(event.get('body', '{}'))
    
    room_name = body_data.get('room_name', 'Не указано')
    guest_name = body_data.get('guest_name', 'Не указано')
    guest_phone = body_data.get('guest_phone', 'Не указано')
    check_in_date = body_data.get('check_in_date', 'Не указано')
    check_out_date = body_data.get('check_out_date', 'Не указано')
    guests_count = body_data.get('guests_count', 1)
    comment = body_data.get('comment', 'Нет')
    
    msg = MIMEMultipart('alternative')
    msg['Subject'] = f'Новое бронирование: {room_name}'
    msg['From'] = smtp_user
    msg['To'] = admin_email
    
    html_content = f'''
    <html>
      <head>
        <style>
          body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
          .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
          .header {{ background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 20px; border-radius: 10px 10px 0 0; }}
          .content {{ background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }}
          .info-row {{ margin: 15px 0; padding: 10px; background: white; border-radius: 5px; }}
          .label {{ font-weight: bold; color: #10b981; }}
          .value {{ color: #333; }}
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 style="margin: 0;">🌲 Новое бронирование!</h1>
            <p style="margin: 5px 0 0 0;">Турбаза "Сосны"</p>
          </div>
          <div class="content">
            <div class="info-row">
              <span class="label">Номер:</span>
              <span class="value">{room_name}</span>
            </div>
            <div class="info-row">
              <span class="label">Гость:</span>
              <span class="value">{guest_name}</span>
            </div>
            <div class="info-row">
              <span class="label">Телефон:</span>
              <span class="value">{guest_phone}</span>
            </div>
            <div class="info-row">
              <span class="label">Дата заезда:</span>
              <span class="value">{check_in_date}</span>
            </div>
            <div class="info-row">
              <span class="label">Дата выезда:</span>
              <span class="value">{check_out_date}</span>
            </div>
            <div class="info-row">
              <span class="label">Количество гостей:</span>
              <span class="value">{guests_count}</span>
            </div>
            <div class="info-row">
              <span class="label">Комментарий:</span>
              <span class="value">{comment}</span>
            </div>
            <p style="margin-top: 20px; color: #6b7280; font-size: 14px;">
              Получено: {datetime.now().strftime('%d.%m.%Y %H:%M')}
            </p>
          </div>
        </div>
      </body>
    </html>
    '''
    
    text_content = f'''
    Новое бронирование - Турбаза "Сосны"
    
    Номер: {room_name}
    Гость: {guest_name}
    Телефон: {guest_phone}
    Дата заезда: {check_in_date}
    Дата выезда: {check_out_date}
    Количество гостей: {guests_count}
    Комментарий: {comment}
    
    Получено: {datetime.now().strftime('%d.%m.%Y %H:%M')}
    '''
    
    part1 = MIMEText(text_content, 'plain', 'utf-8')
    part2 = MIMEText(html_content, 'html', 'utf-8')
    
    msg.attach(part1)
    msg.attach(part2)
    
    try:
        server = smtplib.SMTP(smtp_host, smtp_port)
        server.starttls()
        server.login(smtp_user, smtp_password)
        server.send_message(msg)
        server.quit()
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({
                'success': True,
                'message': 'Email notification sent successfully'
            }, ensure_ascii=False),
            'isBase64Encoded': False
        }
    
    except Exception as e:
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({
                'success': False,
                'message': f'Failed to send email: {str(e)}'
            }, ensure_ascii=False),
            'isBase64Encoded': False
        }
