# โปรเจกต์ E-Commerce API

โปรเจกต์นี้พัฒนา RESTful API สำหรับระบบ E-commerce ซึ่งพัฒนาขึ้นตามข้อกำหนดเฉพาะทางด้านความปลอดภัย ความสามารถในการขยายระบบ และคุณภาพของโค้ด

## CheckList ความต้องการของโปรเจคจบคอร์ส

### 1. การออกแบบ API และสถาปัตยกรรม
* **มาตรฐาน RESTful**: จัดการทรัพยากร (Users, Products, Orders) ผ่าน HTTP methods มาตรฐาน
* **โครงสร้าง URI**: การออกแบบ URI ที่สะอาดและสื่อความหมาย
* **Versioning**: ให้บริการ API ภายใต้ path `/api/v1`
* **โครงสร้างโค้ด**: ปฏิบัติตามรูปแบบ MVC และหลักการออกแบบ SOLID

### 2. กลไกความปลอดภัย
* **Authentication**: ใช้งาน **JWT** ในการยืนยันตัวตน
* **Authorization**: ควบคุมการเข้าถึงตามบทบาท RBAC สำหรับ `Admin` และ `User`
* **Rate Limiting**: จำกัดความถี่การเรียกใช้งาน request ด้วย `express-rate-limit`
* **Security Headers**: ใช้งาน `helmet` เพื่อเพิ่มความปลอดภัย HTTP headers

### 3. ความน่าเชื่อถือและความถูกต้องของข้อมูล
* **Idempotency**: ป้องกันการทำรายการซ้ำในจุดสำคัญ เช่น คำสั่งซื้อ
* **Validation**: การตรวจสอบความถูกต้องของข้อมูล Input สำหรับ API
* **Error Handling**: มีกลไกจัดการข้อผิดพลาดแบบรวมศูนย์

### 4. ประสิทธิภาพและการตรวจสอบ
* **Caching**: ใช้งาน Caching เพื่อเพิ่มความเร็วในการดึงข้อมูล
* **Logging**: เชื่อมต่อ `winston` สำหรับ log ของระบบ และ `morgan` สำหรับ HTTP traffic
* **Unit Tests**: มีชุดการทดสอบโดยใช้ **Jest** และ **Supertest**
* **Documentation**: สร้างเอกสาร API อัตโนมัติด้วย **Swagger**

## เริ่มต้นใช้งาน

### Requirements
* Node.js
* MongoDB

### ขั้นตอนการติดตั้ง
1.  ติดตั้ง dependencies:
    ```
    npm install
    ```
2.  ตั้งค่าไฟล์ `.env` (ดูตัวอย่างที่ `.env.example` หรือสร้างใหม่ตาม config ที่กำหนด)
3.  รันเซิร์ฟเวอร์:
    ```
    npm start
    ```
    หรือ
    ```
    npm run dev
    ```
4.  เข้าใช้งานเอกสาร API (API Documentation):
    * URL: `http://localhost:portที่ตั้ง/api-docs`