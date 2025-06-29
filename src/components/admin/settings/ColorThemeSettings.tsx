
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Save, Plus, Trash2 } from 'lucide-react';

interface ColorTheme {
  id: string;
  name: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
}

const ColorThemeSettings = () => {
  const [colorThemes, setColorThemes] = useState<ColorTheme[]>([
    {
      id: '1',
      name: 'الألوان العراقية',
      primaryColor: '#CE1126',
      secondaryColor: '#FFFFFF', 
      accentColor: '#007A3D'
    },
    {
      id: '2',
      name: 'الأزرق الكلاسيكي',
      primaryColor: '#2563EB',
      secondaryColor: '#F8FAFC',
      accentColor: '#10B981'
    }
  ]);

  const [selectedTheme, setSelectedTheme] = useState('1');

  const addColorTheme = () => {
    const newTheme: ColorTheme = {
      id: Date.now().toString(),
      name: '',
      primaryColor: '#000000',
      secondaryColor: '#FFFFFF',
      accentColor: '#888888'
    };
    setColorThemes([...colorThemes, newTheme]);
  };

  const updateColorTheme = (id: string, field: keyof ColorTheme, value: string) => {
    setColorThemes(themes => 
      themes.map(theme => 
        theme.id === id ? { ...theme, [field]: value } : theme
      )
    );
  };

  const deleteColorTheme = (id: string) => {
    setColorThemes(themes => themes.filter(theme => theme.id !== id));
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-right">قوالب الألوان</CardTitle>
        <Button onClick={addColorTheme} size="sm">
          <Plus className="w-4 h-4 ml-2" />
          إضافة قالب
        </Button>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label>القالب النشط</Label>
          <select
            value={selectedTheme}
            onChange={(e) => setSelectedTheme(e.target.value)}
            className="w-full p-2 border rounded text-right"
          >
            {colorThemes.map((theme) => (
              <option key={theme.id} value={theme.id}>
                {theme.name}
              </option>
            ))}
          </select>
        </div>
        
        {colorThemes.map((theme) => (
          <div key={theme.id} className="border rounded-lg p-4 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">قالب #{theme.id}</h3>
              <Button 
                onClick={() => deleteColorTheme(theme.id)}
                variant="destructive" 
                size="sm"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label>اسم القالب</Label>
                <Input
                  value={theme.name}
                  onChange={(e) => updateColorTheme(theme.id, 'name', e.target.value)}
                  className="text-right"
                />
              </div>
              <div className="space-y-2">
                <Label>اللون الأساسي</Label>
                <Input
                  value={theme.primaryColor}
                  onChange={(e) => updateColorTheme(theme.id, 'primaryColor', e.target.value)}
                  type="color"
                />
              </div>
              <div className="space-y-2">
                <Label>اللون الثانوي</Label>
                <Input
                  value={theme.secondaryColor}
                  onChange={(e) => updateColorTheme(theme.id, 'secondaryColor', e.target.value)}
                  type="color"
                />
              </div>
              <div className="space-y-2">
                <Label>لون التمييز</Label>
                <Input
                  value={theme.accentColor}
                  onChange={(e) => updateColorTheme(theme.id, 'accentColor', e.target.value)}
                  type="color"
                />
              </div>
            </div>
            <div className="flex space-x-2 space-x-reverse">
              <div 
                className="w-8 h-8 rounded border" 
                style={{ backgroundColor: theme.primaryColor }}
              ></div>
              <div 
                className="w-8 h-8 rounded border" 
                style={{ backgroundColor: theme.secondaryColor }}
              ></div>
              <div 
                className="w-8 h-8 rounded border" 
                style={{ backgroundColor: theme.accentColor }}
              ></div>
            </div>
          </div>
        ))}
        <Button className="w-full">
          <Save className="w-4 h-4 ml-2" />
          حفظ قوالب الألوان
        </Button>
      </CardContent>
    </Card>
  );
};

export default ColorThemeSettings;
