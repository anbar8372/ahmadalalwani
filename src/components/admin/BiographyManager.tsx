
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Save, Plus, Trash2 } from 'lucide-react';
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
  
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo>({
    fullName: 'أحمد سليمان العلواني',
    birthDate: '27 أبريل، 1969',
    birthPlace: 'الرمادي، محافظة الأنبار، العراق',
    religion: 'مسلم',
    nationality: 'عراقي'
  });

  const [earlyLife, setEarlyLife] = useState('');
  const [personalCharacter, setPersonalCharacter] = useState('');
  
  const [educationSections, setEducationSections] = useState<EducationSection[]>([
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
  ]);

  const handleSavePersonalInfo = () => {
    toast({
      title: "تم الحفظ بنجاح",
      description: "تم حفظ المعلومات الشخصية",
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
    setEducationSections([...educationSections, newSection]);
  };

  const updateEducationSection = (id: string, field: keyof EducationSection, value: string) => {
    setEducationSections(sections => 
      sections.map(section => 
        section.id === id ? { ...section, [field]: value } : section
      )
    );
  };

  const deleteEducationSection = (id: string) => {
    setEducationSections(sections => sections.filter(section => section.id !== id));
  };

  return (
    <div className="space-y-6">
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
                onChange={(e) => setPersonalInfo({...personalInfo, fullName: e.target.value})}
                className="text-right"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="birth-date">تاريخ الميلاد</Label>
              <Input
                id="birth-date"
                value={personalInfo.birthDate}
                onChange={(e) => setPersonalInfo({...personalInfo, birthDate: e.target.value})}
                className="text-right"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="birth-place">مكان الميلاد</Label>
              <Input
                id="birth-place"
                value={personalInfo.birthPlace}
                onChange={(e) => setPersonalInfo({...personalInfo, birthPlace: e.target.value})}
                className="text-right"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="religion">الديانة</Label>
              <Input
                id="religion"
                value={personalInfo.religion}
                onChange={(e) => setPersonalInfo({...personalInfo, religion: e.target.value})}
                className="text-right"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="nationality">الجنسية</Label>
              <Input
                id="nationality"
                value={personalInfo.nationality}
                onChange={(e) => setPersonalInfo({...personalInfo, nationality: e.target.value})}
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
              onChange={(e) => setEarlyLife(e.target.value)}
              className="text-right min-h-[200px]"
              placeholder="اكتب عن النشأة والتكوين المبكر..."
            />
          </div>
          <Button className="w-full">
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
          <Button className="w-full">
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
              onChange={(e) => setPersonalCharacter(e.target.value)}
              className="text-right min-h-[200px]"
              placeholder="اكتب عن الشخصية والمبادئ..."
            />
          </div>
          <Button className="w-full">
            <Save className="w-4 h-4 ml-2" />
            حفظ الشخصية والمبادئ
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default BiographyManager;
