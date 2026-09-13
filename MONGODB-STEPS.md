# 🗄️ الداتابيز (MongoDB) — خطوة بخطوة

> **مجاني تماماً وللأبد.** الخطة المجانية (M0) بتديك 512 ميجا — البوت بتاعك
> محتاج أقل من 50 ميجا حتى لو السيرفر كبر.

---

## ليه البوت محتاج داتابيز أصلاً؟

من غيرها **مفيش**: مستويات · اقتصاد · تذاكر · تحذيرات · إعدادات السيرفر ·
ذاكرة الـ AI. كل حاجة بتتنسي أول ما البوت يعمل restart.

---

## 1️⃣ اعمل حساب (دقيقتين)

1. ادخل <https://www.mongodb.com/cloud/atlas/register>
2. سجّل بحساب **جوجل** (أسرع حاجة)
3. لو سألك أسئلة ترحيبية، اختار أي إجابة أو دوس **Skip**

---

## 2️⃣ اعمل Cluster مجاني

1. هيظهرلك **Deploy your cluster**
2. اختار **M0 FREE** — تأكد إن مكتوب عليها **$0/month**

   > ⚠️ متختارش M10 أو Flex — دول بفلوس

3. **Provider:** AWS · **Region:** اختار الأقرب (مثلاً `eu-central-1` فرانكفورت)
4. **Cluster Name:** سيبه `Cluster0`
5. دوس **Create Deployment**

---

## 3️⃣ اليوزر والباسورد ⚠️ (أهم خطوة)

هيظهرلك **Connect to Cluster0**:

1. هيديك **Username** و**Password** جاهزين
2. 🔴 **انسخ الباسورد ده في مكان آمن حالاً** — مش هيظهر تاني
3. دوس **Create Database User**

> 💡 لو الباسورد فيه رموز غريبة زي `@` أو `#` أو `/`، اعمل واحد جديد من
> **Database Access → Edit → Edit Password** وخليه **حروف وأرقام بس**.
> الرموز دي بتكسر رابط الاتصال.

---

## 4️⃣ افتح الشبكة 🔴 (السبب الأول للفشل)

Wispbyte مالوش IP ثابت، فلازم تسمح للكل:

1. من القايمة الشمال: **Network Access**
2. **+ ADD IP ADDRESS**
3. دوس **ALLOW ACCESS FROM ANYWHERE** → هيكتب `0.0.0.0/0`
4. **Confirm**

> ✅ مفيش خطر: الاتصال لسه محتاج اليوزر والباسورد.

انتظر لحد ما الحالة تبقى **Active** (١-٢ دقيقة).

---

## 5️⃣ هات رابط الاتصال

1. **Database** (القايمة الشمال) → دوس **Connect** جنب Cluster0
2. اختار **Drivers**
3. **Driver:** Node.js · **Version:** 5.5 or later
4. هتلاقي رابط شكله كده:

```
mongodb+srv://abdo:<db_password>@cluster0.ab1cd.mongodb.net/?retryWrites=true&w=majority
```

5. **انسخه**

---

## 6️⃣ ظبّط الرابط (خطوتين مهمين)

### أ. حط الباسورد مكان `<db_password>`

امسح `<db_password>` **مع الأقواس** وحط الباسورد بتاعك:

```
❌ mongodb+srv://abdo:<db_password>@cluster0...
❌ mongodb+srv://abdo:<Pass123>@cluster0...     ← الأقواس لسه موجودة
✅ mongodb+srv://abdo:Pass123@cluster0...
```

### ب. حط اسم الداتابيز قبل علامة `?`

```
❌ ...mongodb.net/?retryWrites=true
✅ ...mongodb.net/ccimmune?retryWrites=true
```

**الشكل النهائي الصح:**
```
mongodb+srv://abdo:Pass123@cluster0.ab1cd.mongodb.net/ccimmune?retryWrites=true&w=majority
```

---

## 7️⃣ حطه في Wispbyte

**Startup → Variables:**
```
MONGO_URI = mongodb+srv://abdo:Pass123@cluster0.ab1cd.mongodb.net/ccimmune?retryWrites=true&w=majority
```

اعمل **Restart**. المفروض تشوف:
```
[SUCCESS] [Database] Connected to MongoDB in 1174ms (db: ccimmune, pool: 10)
```

---

## ❌ حل الأخطاء

| الرسالة في اللوج | السبب | الحل |
|---|---|---|
| `Authentication failed` | الباسورد غلط أو الأقواس `<>` لسه موجودة | راجع خطوة 6-أ |
| `connection refused` · `DB-002` | الشبكة مقفولة | راجع خطوة 4 |
| `querySrv ENOTFOUND` | الرابط ناقص أو متكتب غلط | انسخه تاني من Atlas |
| `MONGO_URI must start with...` | الرابط فيه مسافة أو ناقص أوله | لازم يبدأ بـ `mongodb+srv://` |
| `Invalid scheme` | نسخت الرابط غلط | استخدم **Drivers** مش **Compass** |
| البوت مش بيقوم خالص | `MONGO_URI` مش موجود | ضيفه في Variables |

> 🔍 **مهم:** لو الباسورد فيه `@` أو `:` أو `/` أو `#` — **غيّره** لحروف
> وأرقام بس. دي أكتر حاجة بتفشّل الاتصال.

---

## ✅ اتأكد إنها شغالة

بعد الـ Restart، جوه ديسكورد اكتب:
```
/doctor health
```
هيوريك حالة كل الخدمات، والداتابيز المفروض تبقى **✅ ok**.
