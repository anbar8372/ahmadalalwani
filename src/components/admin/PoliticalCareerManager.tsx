
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Save, Plus, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface PoliticalPosition {
  id: string;
  title: string;
  period: string;
  description: string;
  responsibilities: string[];
}

interface PoliticalEvent {
  id: string;
  title: string;
  date: string;
  description: string;
  image: string;
}

const PoliticalCareerManager = () => {
  const { toast } = useToast();
  
  const [positions, setPositions] = useState<PoliticalPosition[]>([
    {
      id: '1',
      title: 'نائب في البرلمان العراقي',
      period: '2010-2013',
      description: 'عمل كعضو في مجلس النواب العراقي ممثلاً لمحافظة الأنبار',
      responsibilities: [
        'رئاسة اللجنة الاقتصادية',
        'المشاركة في وضع القوانين الاقتصادية',
        'تمثيل مصالح المواطنين'
      ]
    }
  ]);

  const [politicalEvents, setPoliticalEvents] = useState<PoliticalEvent[]>([
    {
      id: '1',
      title: 'انتخاب لعضوية البرلمان',
      date: '2010',
      description: 'تم انتخابه لعضوية مجلس النواب العراقي',
      image: ''
    }
  ]);

  const [careerOverview, setCareerOverview] = useState('');

  const addPosition = () => {
    const newPosition: PoliticalPosition = {
      id: Date.now().toString(),
      title: '',
      period: '',
      description: '',
      responsibilities: []
    };
    setPositions([...positions, newPosition]);
  };

  const updatePosition = (id: string, field: keyof Omit<PoliticalPosition, 'responsibilities'>, value: string) => {
    setPositions(positions => 
      positions.map(position => 
        position.id === id ? { ...position, [field]: value } : position
      )
    );
  };

  const updatePositionResponsibilities = (id: string, responsibilities: string[]) => {
    setPositions(positions => 
      positions.map(position => 
        position.id === id ? { ...position, responsibilities } : position
      )
    );
  };

  const deletePosition = (id: string) => {
    setPositions(positions => positions.filter(position => position.id !== id));
  };

  const addEvent = () => {
    const newEvent: PoliticalEvent = {
      id: Date.now().toString(),
      title: '',
      date: '',
      description: '',
      image: ''
    };
    setPoliticalEvents([...politicalEvents, newEvent]);
  };

  const updateEvent = (id: string, field: keyof PoliticalEvent, value: string) => {
    setPoliticalEvents(events => 
      events.map(event => 
        event.id === id ? { ...event, [field]: value } : event
      )
    );
  };

  const deleteEvent = (id: string) => {
    setPoliticalEvents(events => events.filter(event => event.id !== id));
  };

  return (
    <div className="space-y-6">
      {/* Career Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="text-right">نظرة عامة على المسيرة السياسية</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="career-overview">النص التعريفي</Label>
            <Textarea
              id="career-overview"
              value={careerOverview}
              onChange={(e) => setCareerOverview(e.target.value)}
              className="text-right min-h-[150px]"
              placeholder="اكتب نبذة عن المسيرة السياسية..."
            />
          </div>
          <Button className="w-full">
            <Save className="w-4 h-4 ml-2" />
            حفظ النظرة العامة
          </Button>
        </CardContent>
      </Card>

      {/* Political Positions */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-right">المناصب السياسية</CardTitle>
          <Button onClick={addPosition} size="sm">
            <Plus className="w-4 h-4 ml-2" />
            إضافة منصب
          </Button>
        </CardHeader>
        <CardContent className="space-y-6">
          {positions.map((position) => (
            <div key={position.id} className="border rounded-lg p-4 space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">منصب #{position.id}</h3>
                <Button 
                  onClick={() => deletePosition(position.id)}
                  variant="destructive" 
                  size="sm"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>اسم المنصب</Label>
                  <Input
                    value={position.title}
                    onChange={(e) => updatePosition(position.id, 'title', e.target.value)}
                    className="text-right"
                  />
                </div>
                <div className="space-y-2">
                  <Label>الفترة الزمنية</Label>
                  <Input
                    value={position.period}
                    onChange={(e) => updatePosition(position.id, 'period', e.target.value)}
                    className="text-right"
                    placeholder="2010-2013"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>الوصف</Label>
                <Textarea
                  value={position.description}
                  onChange={(e) => updatePosition(position.id, 'description', e.target.value)}
                  className="text-right"
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label>المسؤوليات (كل مسؤولية في سطر منفصل)</Label>
                <Textarea
                  value={position.responsibilities.join('\n')}
                  onChange={(e) => updatePositionResponsibilities(position.id, e.target.value.split('\n').filter(r => r.trim()))}
                  className="text-right"
                  rows={4}
                  placeholder="رئاسة اللجنة الاقتصادية&#10;المشاركة في وضع القوانين&#10;تمثيل المواطنين"
                />
              </div>
            </div>
          ))}
          <Button className="w-full">
            <Save className="w-4 h-4 ml-2" />
            حفظ المناصب السياسية
          </Button>
        </CardContent>
      </Card>

      {/* Political Events */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-right">الأحداث السياسية المهمة</CardTitle>
          <Button onClick={addEvent} size="sm">
            <Plus className="w-4 h-4 ml-2" />
            إضافة حدث
          </Button>
        </CardHeader>
        <CardContent className="space-y-6">
          {politicalEvents.map((event) => (
            <div key={event.id} className="border rounded-lg p-4 space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">حدث #{event.id}</h3>
                <Button 
                  onClick={() => deleteEvent(event.id)}
                  variant="destructive" 
                  size="sm"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>عنوان الحدث</Label>
                  <Input
                    value={event.title}
                    onChange={(e) => updateEvent(event.id, 'title', e.target.value)}
                    className="text-right"
                  />
                </div>
                <div className="space-y-2">
                  <Label>التاريخ</Label>
                  <Input
                    value={event.date}
                    onChange={(e) => updateEvent(event.id, 'date', e.target.value)}
                    className="text-right"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>الوصف</Label>
                <Textarea
                  value={event.description}
                  onChange={(e) => updateEvent(event.id, 'description', e.target.value)}
                  className="text-right"
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label>رابط الصورة</Label>
                <Input
                  value={event.image}
                  onChange={(e) => updateEvent(event.id, 'image', e.target.value)}
                  className="text-right"
                  placeholder="https://example.com/image.jpg"
                />
              </div>
            </div>
          ))}
          <Button className="w-full">
            <Save className="w-4 h-4 ml-2" />
            حفظ الأحداث السياسية
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default PoliticalCareerManager;
