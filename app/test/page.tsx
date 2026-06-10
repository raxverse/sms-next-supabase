'use client';
import { Text, Paragraph, Button } from '@/app/components/UI';

export default function MyPage() {
  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      
      {/* TEXT: Heading ya chhote elements ke liye */}
      <Text textSize="32px" weight="bold" color="#333" m="0 0 10px 0" style={{ display: 'block' }}>
        Welcome to My App
      </Text>

      {/* PARAGRAPH: Lambi details ke liye */}
      <Paragraph textSize="18px" color="#666" m="0 0 20px 0">
        Ye ek paragraph component hai. Iski line height default 1.6 set hai 
        taki user ko padhne mein aasani ho. Aap yahan apna pura description 
        ya article ka content dal sakte hain bina kisi extra CSS ke.
      </Paragraph>

      {/* BUTTON: Actions ke liye */}
      <Button bg="#ff4757" color="white" onClick={() => alert('Clicked!')}>
        Click Me
      </Button>

      {/* OUTLINE BUTTON */}
      <Button variant="outline" bg="#ff4757" m="0 0 0 15px">
        Cancel
      </Button>

    </div>
  );
}