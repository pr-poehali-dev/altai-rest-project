import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { toast } from '@/hooks/use-toast';

interface Booking {
  id: number;
  room_id: string;
  room_name: string;
  guest_name: string;
  guest_phone: string;
  check_in_date: string;
  check_out_date: string | null;
  guests_count: number;
  comment: string;
  status: string;
  created_at: string;
}

const Admin = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://functions.poehali.dev/6b36d050-396a-4045-95a6-d39c9cba8164');
      const data = await response.json();
      
      if (response.ok) {
        setBookings(data.bookings || []);
      } else {
        toast({
          title: 'Ошибка',
          description: 'Не удалось загрузить бронирования',
          variant: 'destructive'
        });
      }
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Проблема с подключением к серверу',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '—';
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const filteredBookings = filter === 'all' 
    ? bookings 
    : bookings.filter(b => b.room_id === filter);

  const stats = {
    total: bookings.length,
    today: bookings.filter(b => {
      const today = new Date().toISOString().split('T')[0];
      return b.created_at.split('T')[0] === today;
    }).length,
    rooms: Array.from(new Set(bookings.map(b => b.room_id))).length
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 via-white to-blue-50">
      <header className="bg-white border-b sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Icon name="TreePine" className="text-emerald-600" size={32} />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Админ-панель</h1>
                <p className="text-sm text-gray-600">Турбаза "Сосны"</p>
              </div>
            </div>
            <Button 
              variant="outline"
              onClick={() => window.location.href = '/'}
              className="border-emerald-600 text-emerald-600 hover:bg-emerald-50"
            >
              <Icon name="Home" size={18} className="mr-2" />
              На главную
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Icon name="Calendar" size={24} />
                Всего бронирований
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold">{stats.total}</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Icon name="Clock" size={24} />
                Сегодня
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold">{stats.today}</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-amber-500 to-amber-600 text-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Icon name="Home" size={24} />
                Активных номеров
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold">{stats.rooms}</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl">Список бронирований</CardTitle>
              <div className="flex gap-2">
                <Button
                  variant={filter === 'all' ? 'default' : 'outline'}
                  onClick={() => setFilter('all')}
                  className={filter === 'all' ? 'bg-emerald-600' : ''}
                >
                  Все
                </Button>
                <Button
                  variant={filter === '1' ? 'default' : 'outline'}
                  onClick={() => setFilter('1')}
                  className={filter === '1' ? 'bg-emerald-600' : ''}
                >
                  Люкс "Кедр"
                </Button>
                <Button
                  variant={filter === '2' ? 'default' : 'outline'}
                  onClick={() => setFilter('2')}
                  className={filter === '2' ? 'bg-emerald-600' : ''}
                >
                  Стандарт "Сосна"
                </Button>
                <Button
                  variant={filter === '3' ? 'default' : 'outline'}
                  onClick={() => setFilter('3')}
                  className={filter === '3' ? 'bg-emerald-600' : ''}
                >
                  Семейный "Алтай"
                </Button>
                <Button
                  variant="outline"
                  onClick={fetchBookings}
                  disabled={loading}
                >
                  <Icon name="RotateCw" size={18} className={loading ? 'animate-spin' : ''} />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Icon name="Loader2" size={32} className="animate-spin text-emerald-600" />
              </div>
            ) : filteredBookings.length === 0 ? (
              <div className="text-center py-12">
                <Icon name="Inbox" size={48} className="mx-auto text-gray-400 mb-4" />
                <p className="text-gray-600 text-lg">Бронирований пока нет</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Номер</TableHead>
                      <TableHead>Гость</TableHead>
                      <TableHead>Телефон</TableHead>
                      <TableHead>Заезд</TableHead>
                      <TableHead>Выезд</TableHead>
                      <TableHead>Гостей</TableHead>
                      <TableHead>Комментарий</TableHead>
                      <TableHead>Статус</TableHead>
                      <TableHead>Создано</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredBookings.map((booking) => (
                      <TableRow key={booking.id}>
                        <TableCell className="font-medium">#{booking.id}</TableCell>
                        <TableCell>{booking.room_name}</TableCell>
                        <TableCell>{booking.guest_name}</TableCell>
                        <TableCell>{booking.guest_phone}</TableCell>
                        <TableCell>{formatDate(booking.check_in_date)}</TableCell>
                        <TableCell>{formatDate(booking.check_out_date)}</TableCell>
                        <TableCell>{booking.guests_count}</TableCell>
                        <TableCell className="max-w-xs truncate">
                          {booking.comment || '—'}
                        </TableCell>
                        <TableCell>
                          <Badge className="bg-emerald-500 text-white">
                            {booking.status === 'confirmed' ? 'Подтверждено' : booking.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{formatDate(booking.created_at)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Admin;
