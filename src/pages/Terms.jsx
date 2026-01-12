import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Phone, MapPin, Mail, Shield, Clock, CreditCard, AlertTriangle, Users } from 'lucide-react';

export default function Terms() {
    const { t, i18n } = useTranslation();
    const isHebrew = i18n.language === 'he';

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#0F172A] py-12 px-4" dir={isHebrew ? 'rtl' : 'ltr'}>
            <div className="container mx-auto max-w-4xl">
                <Card className="shadow-lg">
                    <CardHeader className="text-center border-b bg-muted/20">
                        <CardTitle className="text-3xl font-bold text-primary">
                            {isHebrew ? 'תקנון ותנאי שימוש' : 'Terms of Service'}
                        </CardTitle>
                        <p className="text-muted-foreground mt-2">
                            {isHebrew ? 'עודכן לאחרונה: ינואר 2026' : 'Last updated: January 2026'}
                        </p>
                    </CardHeader>
                    <CardContent className="prose dark:prose-invert max-w-none p-8 space-y-8">

                        {/* Business Details */}
                        <section className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg border border-blue-200 dark:border-blue-800">
                            <h2 className="text-xl font-bold text-blue-800 dark:text-blue-300 mb-4 mt-0 flex items-center gap-2">
                                <Shield className="w-5 h-5" />
                                {isHebrew ? 'פרטי העסק' : 'Business Details'}
                            </h2>
                            <div className="space-y-3 text-blue-700 dark:text-blue-200">
                                <p className="flex items-center gap-2">
                                    <strong>{isHebrew ? 'שם העסק:' : 'Business Name:'}</strong> Ferns
                                </p>
                                <p className="flex items-center gap-2">
                                    <Phone className="w-4 h-4" />
                                    <strong>{isHebrew ? 'טלפון:' : 'Phone:'}</strong>
                                    <a href="tel:0545661641" className="underline hover:text-blue-900 dark:hover:text-blue-100">054-566-1641</a>
                                </p>
                                <p className="flex items-center gap-2">
                                    <MapPin className="w-4 h-4" />
                                    <strong>{isHebrew ? 'כתובת:' : 'Address:'}</strong>
                                    {isHebrew ? 'הנשיא 10, אשקלון' : '10 HaNasi St., Ashkelon, Israel'}
                                </p>
                                <p className="flex items-center gap-2">
                                    <Mail className="w-4 h-4" />
                                    <strong>{isHebrew ? 'מייל:' : 'Email:'}</strong>
                                    <a href="mailto:support@di-biz.com" className="underline hover:text-blue-900 dark:hover:text-blue-100">support@di-biz.com</a>
                                </p>
                            </div>
                        </section>

                        {/* Age Restriction */}
                        <section>
                            <h2 className="text-2xl font-semibold mb-3 text-foreground flex items-center gap-2">
                                <Users className="w-6 h-6 text-primary" />
                                {isHebrew ? 'הגבלת גיל' : 'Age Restriction'}
                            </h2>
                            <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg border border-yellow-200 dark:border-yellow-800">
                                <p className="text-yellow-800 dark:text-yellow-200 font-medium">
                                    {isHebrew
                                        ? 'תנאי לרכישה ושימוש בשירותי Ferns הוא שהמשתמש הינו בן 18 שנים ומעלה. באמצעות רכישת המנוי או שימוש בשירות, המשתמש מצהיר כי הוא עומד בתנאי גיל זה.'
                                        : 'A condition for purchasing and using Ferns services is that the user is 18 years of age or older. By purchasing a subscription or using the service, the user declares that they meet this age requirement.'}
                                </p>
                            </div>
                        </section>

                        {/* Service Description & Delivery */}
                        <section>
                            <h2 className="text-2xl font-semibold mb-3 text-foreground flex items-center gap-2">
                                <Clock className="w-6 h-6 text-primary" />
                                {isHebrew ? 'מדיניות אספקת השירות' : 'Service Delivery Policy'}
                            </h2>
                            <div className="space-y-4 text-muted-foreground">
                                <p>
                                    {isHebrew
                                        ? 'Ferns הינו שירות תוכנה כשירות (SaaS) לניהול תקשורת עסקית בוואטסאפ.'
                                        : 'Ferns is a Software as a Service (SaaS) for managing business WhatsApp communication.'}
                                </p>
                                <ul className="list-disc pl-6 space-y-2">
                                    <li>
                                        {isHebrew
                                            ? 'הגישה לשירות תינתן מיידית עם השלמת תהליך הרישום והתשלום.'
                                            : 'Access to the service will be granted immediately upon completion of registration and payment.'}
                                    </li>
                                    <li>
                                        {isHebrew
                                            ? 'פרטי הגישה והאישור יישלחו לכתובת המייל שהוזנה בעת ההרשמה.'
                                            : 'Access details and confirmation will be sent to the email address provided during registration.'}
                                    </li>
                                    <li>
                                        {isHebrew
                                            ? 'השירות זמין 24/7, למעט תקופות תחזוקה מתוכננות או תקלות בלתי צפויות.'
                                            : 'The service is available 24/7, except during planned maintenance periods or unexpected outages.'}
                                    </li>
                                </ul>
                            </div>
                        </section>

                        {/* Cancellation Policy */}
                        <section>
                            <h2 className="text-2xl font-semibold mb-3 text-foreground flex items-center gap-2">
                                <CreditCard className="w-6 h-6 text-primary" />
                                {isHebrew ? 'מדיניות ביטול והחזרים' : 'Cancellation & Refund Policy'}
                            </h2>
                            <div className="space-y-4">
                                <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border border-red-200 dark:border-red-800">
                                    <p className="text-red-800 dark:text-red-200 font-medium">
                                        {isHebrew
                                            ? 'ניתן לבטל את המנוי תוך 24 שעות ממועד הרכישה בלבד.'
                                            : 'Subscription can be cancelled within 24 hours from the time of purchase only.'}
                                    </p>
                                </div>

                                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                                    <li>
                                        {isHebrew
                                            ? 'לאחר 24 שעות מרגע הרכישה, לא ניתן לבקש החזר כספי.'
                                            : 'After 24 hours from the time of purchase, no refund can be requested.'}
                                    </li>
                                    <li>
                                        {isHebrew
                                            ? 'אין זיכוי יחסי עבור תקופת מנוי שלא נוצלה.'
                                            : 'There is no prorated refund for unused subscription periods.'}
                                    </li>
                                    <li>
                                        {isHebrew
                                            ? 'ביטול המנוי לא יבטל את הגישה באופן מיידי - הגישה תישאר פעילה עד סוף תקופת החיוב הנוכחית.'
                                            : 'Cancelling the subscription will not immediately revoke access - access will remain active until the end of the current billing period.'}
                                    </li>
                                </ul>

                                <div className="bg-muted p-4 rounded-lg">
                                    <p className="font-medium mb-2">{isHebrew ? 'כיצד לבקש ביטול:' : 'How to request cancellation:'}</p>
                                    <ul className="list-disc pl-6 space-y-1 text-sm text-muted-foreground">
                                        <li>
                                            {isHebrew ? 'שליחת מייל ל-' : 'Send an email to '}
                                            <a href="mailto:support@di-biz.com" className="text-primary underline">support@di-biz.com</a>
                                        </li>
                                        <li>
                                            {isHebrew
                                                ? 'דרך עמוד "הגדרות" באתר'
                                                : 'Through the "Settings" page on the website'}
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </section>

                        {/* Liability */}
                        <section>
                            <h2 className="text-2xl font-semibold mb-3 text-foreground flex items-center gap-2">
                                <AlertTriangle className="w-6 h-6 text-primary" />
                                {isHebrew ? 'אחריות והגבלת אחריות' : 'Liability & Disclaimer'}
                            </h2>
                            <div className="space-y-4 text-muted-foreground">
                                <p>
                                    {isHebrew
                                        ? 'Ferns מספקת פלטפורמה לניהול תקשורת עסקית בוואטסאפ. השירות מסופק "As Is" ואנו עושים מאמצים סבירים לשמור על זמינות ואמינות השירות.'
                                        : 'Ferns provides a platform for managing business WhatsApp communication. The service is provided "As Is" and we make reasonable efforts to maintain service availability and reliability.'}
                                </p>

                                <ul className="list-disc pl-6 space-y-2">
                                    <li>
                                        {isHebrew
                                            ? 'החברה ו/או מי מטעמה לא יהיו אחראים לנזק ישיר ו/או עקיף שיגרם כתוצאה משימוש בשירות.'
                                            : 'The company and/or its representatives shall not be liable for any direct or indirect damages resulting from the use of the service.'}
                                    </li>
                                    <li>
                                        {isHebrew
                                            ? 'השירות תלוי בשירותי צד שלישי (כגון WhatsApp, Green API) ולא נישא באחריות לתקלות או שינויים בשירותים אלו.'
                                            : 'The service depends on third-party services (such as WhatsApp, Green API) and we are not responsible for failures or changes in these services.'}
                                    </li>
                                    <li>
                                        {isHebrew
                                            ? 'המשתמש אחראי לשימוש חוקי ואתי בשירות, בהתאם לתנאי השימוש של WhatsApp ולחוקי הספאם והפרטיות.'
                                            : 'The user is responsible for legal and ethical use of the service, in accordance with WhatsApp\'s terms of use and spam/privacy laws.'}
                                    </li>
                                    <li>
                                        {isHebrew
                                            ? 'Ferns לא תהיה אחראית לחסימת מספרי טלפון על ידי WhatsApp כתוצאה משימוש לא נאות בפלטפורמה.'
                                            : 'Ferns will not be responsible for phone number blocking by WhatsApp as a result of improper use of the platform.'}
                                    </li>
                                </ul>
                            </div>
                        </section>

                        {/* Privacy Link */}
                        <section>
                            <h2 className="text-2xl font-semibold mb-3 text-foreground">
                                {isHebrew ? 'מדיניות פרטיות' : 'Privacy Policy'}
                            </h2>
                            <p className="text-muted-foreground">
                                {isHebrew
                                    ? 'מידע מפורט על איסוף ושימוש במידע אישי מופיע ב'
                                    : 'Detailed information about the collection and use of personal data can be found in our '}
                                <Link to="/privacy-policy" className="text-primary underline hover:text-primary/80">
                                    {isHebrew ? 'מדיניות הפרטיות' : 'Privacy Policy'}
                                </Link>.
                            </p>
                        </section>

                        {/* Contact */}
                        <section className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg border border-green-200 dark:border-green-800">
                            <h2 className="text-xl font-bold text-green-800 dark:text-green-300 mb-3 mt-0">
                                {isHebrew ? 'יצירת קשר' : 'Contact Us'}
                            </h2>
                            <p className="text-green-700 dark:text-green-200">
                                {isHebrew
                                    ? 'לשאלות או בירורים בנוגע לתקנון זה, ניתן לפנות אלינו:'
                                    : 'For questions or inquiries regarding these terms, please contact us:'}
                            </p>
                            <div className="mt-3 space-y-2 text-green-700 dark:text-green-200">
                                <p><strong>{isHebrew ? 'מייל:' : 'Email:'}</strong> <a href="mailto:support@di-biz.com" className="underline">support@di-biz.com</a></p>
                                <p><strong>{isHebrew ? 'טלפון:' : 'Phone:'}</strong> <a href="tel:0545661641" className="underline">054-566-1641</a></p>
                            </div>
                        </section>

                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
