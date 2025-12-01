import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';

const Index = () => {
  const [checkInDate, setCheckInDate] = useState<Date | undefined>(new Date());
  const [checkOutDate, setCheckOutDate] = useState<Date | undefined>();
  const [selectedRoom, setSelectedRoom] = useState<{ id: string; name: string } | null>(null);
  const [guestName, setGuestName] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [guestsCount, setGuestsCount] = useState(1);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleBooking = async () => {
    if (!selectedRoom || !guestName || !guestPhone || !checkInDate) {
      toast({
        title: 'Ошибка',
        description: 'Заполните все обязательные поля',
        variant: 'destructive'
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('https://functions.poehali.dev/6b36d050-396a-4045-95a6-d39c9cba8164', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          room_id: selectedRoom.id,
          room_name: selectedRoom.name,
          guest_name: guestName,
          guest_phone: guestPhone,
          check_in_date: checkInDate.toISOString().split('T')[0],
          check_out_date: checkOutDate?.toISOString().split('T')[0],
          guests_count: guestsCount,
          comment: comment
        })
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: 'Успешно!',
          description: 'Ваше бронирование принято. Мы свяжемся с вами в ближайшее время.',
        });
        setDialogOpen(false);
        setGuestName('');
        setGuestPhone('');
        setComment('');
        setGuestsCount(1);
      } else {
        toast({
          title: 'Ошибка',
          description: data.error || 'Не удалось создать бронирование',
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
      setIsSubmitting(false);
    }
  };

  const rooms = [
    {
      id: '1',
      name: 'Люкс "Кедр"',
      description: 'Просторный номер с панорамным видом на горы',
      price: '8500',
      features: ['2 комнаты', 'Балкон', 'Мини-кухня', 'Камин'],
      available: true,
      image: 'https://cdn.poehali.dev/projects/4e115b53-2a8d-4f05-92e4-5196e4e9c0eb/files/2f8413d7-0a6e-4acb-9ea8-bba3726ec9d6.jpg'
    },
    {
      id: '2',
      name: 'Стандарт "Сосна"',
      description: 'Уютный номер в окружении соснового леса',
      price: '4500',
      features: ['1 комната', 'Вид на лес', 'Санузел'],
      available: true,
      image: 'https://cdn.poehali.dev/projects/4e115b53-2a8d-4f05-92e4-5196e4e9c0eb/files/2f8413d7-0a6e-4acb-9ea8-bba3726ec9d6.jpg'
    },
    {
      id: '3',
      name: 'Семейный "Алтай"',
      description: 'Идеальный вариант для семейного отдыха',
      price: '6500',
      features: ['2 спальни', 'Гостиная', 'Детская зона'],
      available: false,
      image: 'https://cdn.poehali.dev/projects/4e115b53-2a8d-4f05-92e4-5196e4e9c0eb/files/2f8413d7-0a6e-4acb-9ea8-bba3726ec9d6.jpg'
    }
  ];

  const services = [
    {
      icon: 'Flame',
      title: 'Банный комплекс',
      description: 'Русская баня, финская сауна с панорамным видом, бассейн с подогревом'
    },
    {
      icon: 'Waves',
      title: 'Бассейн',
      description: 'Крытый подогреваемый бассейн с зоной отдыха и видом на горы'
    },
    {
      icon: 'Sparkles',
      title: 'СПА-услуги',
      description: 'Классический массаж, антицеллюлитный, лимфодренажный, вакуумный'
    },
    {
      icon: 'UtensilsCrossed',
      title: 'Питание',
      description: 'Завтраки и ужины на заказ, мангальные зоны для барбекю'
    },
    {
      icon: 'Baby',
      title: 'Детская площадка',
      description: 'Безопасная игровая зона с качелями, горками и песочницей'
    },
    {
      icon: 'Mountain',
      title: 'Экскурсии',
      description: 'Организация походов, конных прогулок и экскурсий по Алтаю'
    }
  ];

  const reviews = [
    {
      name: 'Елена Смирнова',
      rating: 5,
      text: 'Потрясающее место! Чистый воздух, красивейшие виды, отличный сервис. Баня с бассейном - просто сказка!',
      date: 'Ноябрь 2024'
    },
    {
      name: 'Дмитрий Козлов',
      rating: 5,
      text: 'Отдыхали семьей неделю. Дети в восторге от площадки, жена от спа-процедур. Обязательно вернемся!',
      date: 'Октябрь 2024'
    },
    {
      name: 'Ирина Петрова',
      rating: 5,
      text: 'Уютная атмосфера, вкусная еда, приветливый персонал. Идеальное место для отдыха от городской суеты.',
      date: 'Сентябрь 2024'
    }
  ];

  const gallery = [
    'https://cdn.poehali.dev/projects/4e115b53-2a8d-4f05-92e4-5196e4e9c0eb/files/825762e8-db6a-4c41-bb62-2019bce43f95.jpg',
    'https://cdn.poehali.dev/projects/4e115b53-2a8d-4f05-92e4-5196e4e9c0eb/files/60d2a964-3069-432a-8d0f-bf520dd79f7a.jpg',
    'https://cdn.poehali.dev/projects/4e115b53-2a8d-4f05-92e4-5196e4e9c0eb/files/2f8413d7-0a6e-4acb-9ea8-bba3726ec9d6.jpg'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 via-white to-blue-50">
      <header className="fixed top-0 w-full bg-white/90 backdrop-blur-md z-50 shadow-sm">
        <nav className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 animate-fade-in">
            <Icon name="TreePine" className="text-emerald-600" size={32} />
            <div>
              <h1 className="text-2xl font-bold text-emerald-800">Турбаза "Сосны"</h1>
              <p className="text-xs text-emerald-600">Отдых на Алтае</p>
            </div>
          </div>
          <div className="hidden md:flex gap-6">
            <a href="#rooms" className="text-gray-700 hover:text-emerald-600 transition-colors">Номера</a>
            <a href="#services" className="text-gray-700 hover:text-emerald-600 transition-colors">Услуги</a>
            <a href="#gallery" className="text-gray-700 hover:text-emerald-600 transition-colors">Галерея</a>
            <a href="#reviews" className="text-gray-700 hover:text-emerald-600 transition-colors">Отзывы</a>
            <a href="#contacts" className="text-gray-700 hover:text-emerald-600 transition-colors">Контакты</a>
          </div>
          <Button className="bg-emerald-600 hover:bg-emerald-700">
            <Icon name="Phone" size={16} className="mr-2" />
            Позвонить
          </Button>
        </nav>
      </header>

      <section className="pt-32 pb-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-300 rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-300 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }}></div>
        </div>
        
        <div className="container mx-auto relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="animate-slide-in-left">
              <Badge className="mb-4 bg-amber-500 text-white hover:bg-amber-600">
                <Icon name="Sparkles" size={14} className="mr-1" />
                Лучший отдых в горах
              </Badge>
              <h2 className="text-5xl md:text-6xl font-bold mb-6 text-gray-900">
                Турбаза <span className="text-emerald-600">"Сосны"</span>
              </h2>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Окунитесь в атмосферу спокойствия и гармонии в самом сердце Алтая. 
                Комфортабельные номера, банный комплекс, спа-процедуры и незабываемые виды на горы.
              </p>
              <div className="flex gap-4">
                <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-lg">
                  <Icon name="Calendar" size={20} className="mr-2" />
                  Забронировать
                </Button>
                <Button size="lg" variant="outline" className="border-emerald-600 text-emerald-600 hover:bg-emerald-50">
                  <Icon name="Images" size={20} className="mr-2" />
                  Галерея
                </Button>
              </div>
            </div>
            <div className="animate-slide-in-right">
              <img 
                src="https://cdn.poehali.dev/projects/4e115b53-2a8d-4f05-92e4-5196e4e9c0eb/files/825762e8-db6a-4c41-bb62-2019bce43f95.jpg"
                alt="Турбаза Сосны"
                className="rounded-3xl shadow-2xl w-full object-cover h-[500px]"
              />
            </div>
          </div>
        </div>
      </section>

      <section id="rooms" className="py-20 px-4 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-12 animate-fade-in">
            <Badge className="mb-4 bg-blue-500 text-white">
              <Icon name="Home" size={14} className="mr-1" />
              Размещение
            </Badge>
            <h2 className="text-4xl font-bold mb-4 text-gray-900">Наши номера</h2>
            <p className="text-gray-600 text-lg">Выберите идеальный вариант для вашего отдыха</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {rooms.map((room, idx) => (
              <Card key={room.id} className="overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-2" style={{ animationDelay: `${idx * 0.1}s` }}>
                <div className="relative">
                  <img src={room.image} alt={room.name} className="w-full h-64 object-cover" />
                  {!room.available && (
                    <Badge className="absolute top-4 right-4 bg-red-500 text-white">Занято</Badge>
                  )}
                  {room.available && (
                    <Badge className="absolute top-4 right-4 bg-emerald-500 text-white">Доступно</Badge>
                  )}
                </div>
                <CardContent className="p-6">
                  <h3 className="text-2xl font-bold mb-2 text-gray-900">{room.name}</h3>
                  <p className="text-gray-600 mb-4">{room.description}</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {room.features.map((feature) => (
                      <Badge key={feature} variant="outline" className="border-emerald-300 text-emerald-700">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-3xl font-bold text-emerald-600">{room.price} ₽</span>
                      <span className="text-gray-500">/сутки</span>
                    </div>
                    <Dialog open={dialogOpen && selectedRoom?.id === room.id} onOpenChange={(open) => {
                      setDialogOpen(open);
                      if (open) setSelectedRoom({ id: room.id, name: room.name });
                    }}>
                      <DialogTrigger asChild>
                        <Button 
                          className="bg-emerald-600 hover:bg-emerald-700"
                          disabled={!room.available}
                          onClick={() => {
                            setSelectedRoom({ id: room.id, name: room.name });
                            setDialogOpen(true);
                          }}
                        >
                          Забронировать
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[500px]">
                        <DialogHeader>
                          <DialogTitle>Бронирование номера {room.name}</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label>Дата заезда</Label>
                              <Calendar
                                mode="single"
                                selected={checkInDate}
                                onSelect={setCheckInDate}
                                className="rounded-md border"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Дата выезда</Label>
                              <Calendar
                                mode="single"
                                selected={checkOutDate}
                                onSelect={setCheckOutDate}
                                className="rounded-md border"
                              />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="name">Ваше имя *</Label>
                            <Input 
                              id="name" 
                              placeholder="Иван Иванов" 
                              value={guestName}
                              onChange={(e) => setGuestName(e.target.value)}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="phone">Телефон *</Label>
                            <Input 
                              id="phone" 
                              placeholder="+7 (999) 123-45-67" 
                              value={guestPhone}
                              onChange={(e) => setGuestPhone(e.target.value)}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="guests">Количество гостей</Label>
                            <Input 
                              id="guests" 
                              type="number" 
                              min="1"
                              value={guestsCount}
                              onChange={(e) => setGuestsCount(Number(e.target.value))}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="comment">Комментарий</Label>
                            <Textarea 
                              id="comment" 
                              placeholder="Особые пожелания..." 
                              value={comment}
                              onChange={(e) => setComment(e.target.value)}
                            />
                          </div>
                          <Button 
                            className="w-full bg-emerald-600 hover:bg-emerald-700"
                            onClick={handleBooking}
                            disabled={isSubmitting}
                          >
                            {isSubmitting ? 'Отправка...' : 'Отправить заявку'}
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="services" className="py-20 px-4 bg-gradient-to-br from-emerald-50 to-blue-50">
        <div className="container mx-auto">
          <div className="text-center mb-12 animate-fade-in">
            <Badge className="mb-4 bg-amber-500 text-white">
              <Icon name="Star" size={14} className="mr-1" />
              Удобства
            </Badge>
            <h2 className="text-4xl font-bold mb-4 text-gray-900">Наши услуги</h2>
            <p className="text-gray-600 text-lg">Всё для вашего комфортного отдыха</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, idx) => (
              <Card key={idx} className="p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-2 border-transparent hover:border-emerald-300">
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-blue-500 rounded-2xl flex items-center justify-center mb-4">
                  <Icon name={service.icon as any} size={32} className="text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-gray-900">{service.title}</h3>
                <p className="text-gray-600">{service.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="gallery" className="py-20 px-4 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-12 animate-fade-in">
            <Badge className="mb-4 bg-emerald-500 text-white">
              <Icon name="Camera" size={14} className="mr-1" />
              Фотографии
            </Badge>
            <h2 className="text-4xl font-bold mb-4 text-gray-900">Галерея</h2>
            <p className="text-gray-600 text-lg">Посмотрите, как выглядит наша турбаза</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {gallery.map((image, idx) => (
              <div key={idx} className="relative overflow-hidden rounded-2xl group cursor-pointer h-80">
                <img 
                  src={image} 
                  alt={`Галерея ${idx + 1}`}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="reviews" className="py-20 px-4 bg-gradient-to-br from-blue-50 to-emerald-50">
        <div className="container mx-auto">
          <div className="text-center mb-12 animate-fade-in">
            <Badge className="mb-4 bg-blue-500 text-white">
              <Icon name="MessageCircle" size={14} className="mr-1" />
              Отзывы
            </Badge>
            <h2 className="text-4xl font-bold mb-4 text-gray-900">Что говорят наши гости</h2>
            <p className="text-gray-600 text-lg">Реальные отзывы от отдыхающих</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {reviews.map((review, idx) => (
              <Card key={idx} className="p-6 hover:shadow-xl transition-all duration-300">
                <div className="flex items-center gap-1 mb-3">
                  {[...Array(review.rating)].map((_, i) => (
                    <Icon key={i} name="Star" size={18} className="text-amber-500 fill-amber-500" />
                  ))}
                </div>
                <p className="text-gray-700 mb-4 italic">"{review.text}"</p>
                <div className="flex items-center justify-between">
                  <p className="font-semibold text-gray-900">{review.name}</p>
                  <p className="text-sm text-gray-500">{review.date}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="contacts" className="py-20 px-4 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-12 animate-fade-in">
            <Badge className="mb-4 bg-emerald-500 text-white">
              <Icon name="MapPin" size={14} className="mr-1" />
              Связь
            </Badge>
            <h2 className="text-4xl font-bold mb-4 text-gray-900">Контакты</h2>
            <p className="text-gray-600 text-lg">Свяжитесь с нами удобным способом</p>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            <Card className="p-8">
              <h3 className="text-2xl font-bold mb-6 text-gray-900">Наши контакты</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Icon name="Phone" className="text-emerald-600 mt-1" size={24} />
                  <div>
                    <p className="font-semibold text-gray-900">Телефон</p>
                    <p className="text-gray-600">+7 (999) 123-45-67</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Icon name="Mail" className="text-emerald-600 mt-1" size={24} />
                  <div>
                    <p className="font-semibold text-gray-900">Email</p>
                    <p className="text-gray-600">info@sosny-altai.ru</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Icon name="MapPin" className="text-emerald-600 mt-1" size={24} />
                  <div>
                    <p className="font-semibold text-gray-900">Адрес</p>
                    <p className="text-gray-600">Республика Алтай, Майминский район, с. Манжерок</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Icon name="Clock" className="text-emerald-600 mt-1" size={24} />
                  <div>
                    <p className="font-semibold text-gray-900">Режим работы</p>
                    <p className="text-gray-600">Круглосуточно, без выходных</p>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-8">
              <h3 className="text-2xl font-bold mb-6 text-gray-900">Отправить сообщение</h3>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="contact-name">Ваше имя</Label>
                  <Input id="contact-name" placeholder="Иван Иванов" />
                </div>
                <div>
                  <Label htmlFor="contact-phone">Телефон</Label>
                  <Input id="contact-phone" placeholder="+7 (999) 123-45-67" />
                </div>
                <div>
                  <Label htmlFor="contact-message">Сообщение</Label>
                  <Textarea id="contact-message" placeholder="Ваше сообщение..." rows={5} />
                </div>
                <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-lg py-6">
                  <Icon name="Send" size={20} className="mr-2" />
                  Отправить
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </section>

      <footer className="bg-gradient-to-r from-emerald-900 to-emerald-800 text-white py-12 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Icon name="TreePine" size={28} />
                <h3 className="text-2xl font-bold">Турбаза "Сосны"</h3>
              </div>
              <p className="text-emerald-100">Незабываемый отдых в сердце Алтая</p>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-lg">Быстрые ссылки</h4>
              <ul className="space-y-2 text-emerald-100">
                <li><a href="#rooms" className="hover:text-white transition-colors">Номера</a></li>
                <li><a href="#services" className="hover:text-white transition-colors">Услуги</a></li>
                <li><a href="#gallery" className="hover:text-white transition-colors">Галерея</a></li>
                <li><a href="#reviews" className="hover:text-white transition-colors">Отзывы</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-lg">Следите за нами</h4>
              <div className="flex gap-4">
                <Button variant="outline" size="icon" className="border-white/30 text-white hover:bg-white/10">
                  <Icon name="MessageCircle" size={20} />
                </Button>
                <Button variant="outline" size="icon" className="border-white/30 text-white hover:bg-white/10">
                  <Icon name="Phone" size={20} />
                </Button>
                <Button variant="outline" size="icon" className="border-white/30 text-white hover:bg-white/10">
                  <Icon name="Mail" size={20} />
                </Button>
              </div>
            </div>
          </div>
          <div className="border-t border-emerald-700 pt-8 text-center text-emerald-100">
            <div className="flex items-center justify-center gap-4 mb-2">
              <p>© 2024 Турбаза "Сосны". Все права защищены.</p>
              <a href="/admin" className="text-emerald-300 hover:text-white transition-colors text-sm">
                Админ-панель
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;