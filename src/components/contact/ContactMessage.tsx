
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users } from 'lucide-react';

const ContactMessage = () => {
  return (
    <Card className="shadow-lg border-t-4 border-t-primary">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 space-x-reverse text-xl">
          <Users className="w-5 h-5 text-primary" />
          <span>لأهلي الكرام</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-700 leading-relaxed">
          يسعدني أن أستمع إلى آرائكم ومقترحاتكم واستفساراتكم. أعتبر التواصل معكم جزءاً أساسياً من عملي. لا تترددوا في التواصل معي بخصوص أي موضوع يهمكم.
        </p>
      </CardContent>
    </Card>
  );
};

export default ContactMessage;
