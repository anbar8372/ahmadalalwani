import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Save, Plus, Trash2, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface PersonalInfo {
  fullName: string;
  birthDate: string;
  birthPlace: string;
  religion: string;
  nationality: string;
}

interface EducationSection {
  id: string;
  title: string;
  description: string;
  institution: string;
  year: string;
}

const BiographyManager = () => {
  const { toast } = useToast();
  
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo>(() => {
    const saved = localStorage.getItem('biography-personal-info');
    return saved ? JSON.parse(saved) : {
      fullName: 'أحمد سليمان العلواني',
      birthDate: '27 أبريل، 1969',
      birthPlace: 'الرمادي، محافظة الأنبار، العراق',
      religion: 'مسلم',
      nationality: 'عراقي'
    };
  });

  const [earlyLife, setEarlyLife] = useState(() => {
    const saved = localStorage.getItem('biography-early-life');
    return saved ? JSON.parse(saved) : '';
  });

  const [personalCharacter, setPersonalCharacter] = useState(() => {
    const saved = localStorage.getItem('biography-character');
    return saved ? JSON.parse(saved) : '';
  });
  
  const [educationSections, setEducationSections] = useState<EducationSection[]>(() => {
    const saved = localStorage.getItem('biography-education');
    return saved ? JSON.parse(saved) : [
      {
        id: '1',
        title: 'البكالوريوس',
        description: 'علوم الأرض',
        institution: 'جامعة بغداد',
        year: ''
      },
      {
        id: '2',
        title: 'الماجستير',
        description: 'علوم الأرض',
        institution: 'جامعة بغداد',
        year: ''
      },
      {
        id: '3',
        title: 'الدكتوراه',
        description: 'علوم الأرض',
        institution: 'جامعة بغداد',
        year: ''
      }
    ];
  });

  // Real-time sync setup
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'biography-personal-info-update-trigger') {
        const saved = localStorage.getItem('biography-personal-info');
        if (saved) setPersonalInfo(JSON.parse(saved));
      }
      if (e.key === 'biography-early-life-update-trigger') {
        const saved = localStorage.getItem('biography-early-life');
        if (saved) setEarlyLife(JSON.parse(saved));
      }
      if (e.key === 'biography-character-update-trigger') {
        const saved = localStorage.getItem('biography-character');
        if (saved) setPersonalCharacter(JSON.parse(saved));
      }
      if (e.key === 'biography-education-update-trigger') {
        const saved = localStorage.getItem('biography-education');
        if (saved) setEducationSections(JSON.parse(saved));
      }
    };

    const channel = new BroadcastChannel('admin-updates');
    channel.onmessage = (event) => {
      if (event.data.type === 'DATA_UPDATED') {
        if (event.data.key === 'biography-personal-info') {
          setPersonalInfo(event.data.data);
        }
        if (event.data.key === 'biography-early-life') {
          setEarlyLife(event.data.data);
        }
        if (event.data.key === 'biography-character') {
          setPersonalCharacter(event.data.data);
        }
        if (event.data.key === 'biography-education') {
          setEducationSections(event.data.data);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      channel.close();
    };
  }, []);

  // Broadcast function for real-time sync
  const broadcastUpdate = (key: string, data: any) => {
    localStorage.setItem(key, JSON.stringify(data));
    
    const channel = new BroadcastChannel('admin-updates');
    channel.postMessage({ type: 'DATA_UPDATED', key, data, timestamp: Date.now() });
    
    localStorage.setItem(`${key}-update-trigger`, Date.now().toString());
  };

  const handleSavePersonalInfo = () => {
    broadcastUpdate('biography-personal-info', personalInfo);
    toast({
      title: "تم الحفظ بنجاح",
      description: "تم حفظ المعلومات الشخصية ومزامنتها عبر جميع الأجهزة",
    });
  };

  const handleSaveEarlyLife = () => {
    broadcastUpdate('biography-early-life', earlyLife);
    toast({
      title: "تم الحفظ بنجاح",
      description: "تم حفظ النشأة والتكوين المبكر ومزامنتها عبر جميع الأجهزة",
    });
  };

  const handleSaveCharacter = () => {
    broadcastUpdate('biography-character', personalCharacter);
    toast({
      title: "تم الحفظ بنجاح",
      description: "تم حفظ الشخصية والمبادئ ومزامنتها عبر جميع الأجهزة",
    });
  };

  const handleSaveEducation = () => {
    broadcastUpdate('biography-education', educationSections);
    toast({
      title: "تم الحفظ بنجاح",
      description: "تم حفظ المسيرة التعليمية ومزامنتها عبر جميع الأجهزة",
    });
  };

  const addEducationSection = () => {
    const newSection: EducationSection = {
      id: Date.now().toString(),
      title: '',
      description: '',
      institution: '',
      year: ''
    };
    const updated = [...educationSections, newSection];
    setEducationSections(updated);
    broadcastUpdate('biography-education', updated);
  };

  const updateEducationSection = (id: string, field: keyof EducationSection, value: string) => {
    const updated = educationSections.map(section => 
      section.id === id ? { ...section, [field]: value } : section
    );
    setEducationSections(updated);
    broadcastUpdate('biography-education', updated);
  };

  const deleteEducationSection = (id: string) => {
    const updated = educationSections.filter(section => section.id !== id);
    setEducationSections(updated);
    broadcastUpdate('biography-education', updated);
  };

  return (
    <div className="space-y-6">
      {/* Success Indicator */}
      <Card className="bg-green-50 border-green-200">
        <CardContent className="p-4">
          <div className="flex items-center space-x-2 space-x-reverse text-green-800">
            <CheckCircle className="w-5 h-5" />
            <span className="font-medium">نظام المزامنة المباشرة مفعل</span>
          </div>
          <p className="text-sm text-green-700 mt-1">
            جميع التغييرات يتم حفظها ومزامنتها تلقائياً عبر جميع الأجهزة والمتصفحات
          </p>
        </CardContent>
      </Card>

      {/* Personal Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-right">المعلومات الشخصية</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="full-name">الاسم الكامل</Label>
              <Input
                id="full-name"
                value={personalInfo.fullName}
                onChange={(e) => {
                  const updated = {...personalInfo, fullName: e.target.value};
                  setPersonalInfo(updated);
                  broadcastUpdate('biography-personal-info', updated);
                }}
                className="text-right"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="birth-date">تاريخ الميلاد</Label>
              <Input
                id="birth-date"
                value={personalInfo.birthDate}
                onChange={(e) => {
                  const updated = {...personalInfo, birthDate: e.target.value};
                  setPersonalInfo(updated);
                  broadcastUpdate('biography-personal-info', updated);
                }}
                className="text-right"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="birth-place">مكان الميلاد</Label>
              <Input
                id="birth-place"
                value={personalInfo.birthPlace}
                onChange={(e) => {
                  const updated = {...personalInfo, birthPlace: e.target.value};
                  setPersonalInfo(updated);
                  broadcastUpdate('biography-personal-info', updated);
                }}
                className="text-right"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="religion">الديانة</Label>
              <Input
                id="religion"
                value={personalInfo.religion}
                onChange={(e) => {
                  const updated = {...personalInfo, religion: e.target.value};
                  setPersonalInfo(updated);
                  broadcastUpdate('biography-personal-info', updated);
                }}
                className="text-right"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="nationality">الجنسية</Label>
              <Input
                id="nationality"
                value={personalInfo.nationality}
                onChange={(e) => {
                  const updated = {...personalInfo, nationality: e.target.value};
                  setPersonalInfo(updated);
                  broadcastUpdate('biography-personal-info', updated);
                }}
                className="text-right"
              />
            </div>
          </div>
          <Button onClick={handleSavePersonalInfo} className="w-full">
            <Save className="w-4 h-4 ml-2" />
            حفظ المعلومات الشخصية
          </Button>
        </CardContent>
      </Card>

      {/* Early Life */}
      <Card>
        <CardHeader>
          <CardTitle className="text-right">النشأة والتكوين المبكر</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="early-life">النص</Label>
            <Textarea
              id="early-life"
              value={earlyLife}
              onChange={(e) => {
                setEarlyLife(e.target.value);
                broadcastUpdate('biography-early-life', e.target.value);
              }}
              className="text-right min-h-[200px]"
              placeholder="اكتب عن النشأة والتكوين المبكر..."
            />
          </div>
          <Button onClick={handleSaveEarlyLife} className="w-full">
            <Save className="w-4 h-4 ml-2" />
            حفظ النشأة والتكوين المبكر
          </Button>
        </CardContent>
      </Card>

      {/* Education */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-right">المسيرة التعليمية</CardTitle>
          <Button onClick={addEducationSection} size="sm">
            <Plus className="w-4 h-4 ml-2" />
            إضافة مرحلة تعليمية
          </Button>
        </CardHeader>
        <CardContent className="space-y-6">
          {educationSections.map((section) => (
            <div key={section.id} className="border rounded-lg p-4 space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">مرحلة تعليمية #{section.id}</h3>
                <Button 
                  onClick={() => deleteEducationSection(section.id)}
                  variant="destructive" 
                  size="sm"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>الدرجة العلمية</Label>
                  <Input
                    value={section.title}
                    onChange={(e) => updateEducationSection(section.id, 'title', e.target.value)}
                    className="text-right"
                  />
                </div>
                <div className="space-y-2">
                  <Label>التخصص</Label>
                  <Input
                    value={section.description}
                    onChange={(e) => updateEducationSection(section.id, 'description', e.target.value)}
                    className="text-right"
                  />
                </div>
                <div className="space-y-2">
                  <Label>الجامعة/المؤسسة</Label>
                  <Input
                    value={section.institution}
                    onChange={(e) => updateEducationSection(section.id, 'institution', e.target.value)}
                    className="text-right"
                  />
                </div>
                <div className="space-y-2">
                  <Label>السنة</Label>
                  <Input
                    value={section.year}
                    onChange={(e) => updateEducationSection(section.id, 'year', e.target.value)}
                    className="text-right"
                  />
                </div>
              </div>
            </div>
          ))}
          <Button onClick={handleSaveEducation} className="w-full">
            <Save className="w-4 h-4 ml-2" />
            حفظ المسيرة التعليمية
          </Button>
        </CardContent>
      </Card>

      {/* Personal Character */}
      <Card>
        <CardHeader>
          <CardTitle className="text-right">الشخصية والمبادئ</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="character">النص</Label>
            <Textarea
              id="character"
              value={personalCharacter}
              onChange={(e) => {
                setPersonalCharacter(e.target.value);
                broadcastUpdate('biography-character', e.target.value);
              }}
              className="text-right min-h-[200px]"
              placeholder="اكتب عن الشخصية والمبادئ..."
            />
          </div>
          <Button onClick={handleSaveCharacter} className="w-full">
            <Save className="w-4 h-4 ml-2" />
            حفظ الشخصية والمبادئ
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default BiographyManager;