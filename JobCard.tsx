import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Briefcase,
  MapPin,
  Users,
  FileText,
  Mail,
  Phone,
  Loader2,
  AlertTriangle,
  CheckCircle,
  XCircle,
  PlusCircle,
  List,
  Search,
  ChevronDown,
  ChevronUp,
    Info,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"
import { cn } from '@/lib/utils';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"

import { format } from 'date-fns-jalali';
import { enUS } from 'date-fns';

// Mock Data (Replace with actual API calls)
interface Job {
  id: string;
  title: string;
  companyId: string; // Use companyId instead of company name
  location: string;
  description: string;
  requirements: string[];
  salary: string;
  postedDate: string;
  category: string;
  tags: string[];
}

interface Company {
    id: string;
    name: string;
    description: string;
    website: string;
    logo: string;
}

const mockJobs: Job[] = [
    {
        id: '1',
        title: 'برنامه‌نویس ارشد PHP',
        companyId: '1', // شرکت نرم‌افزاری الف
        location: 'تهران',
        description: 'ما به دنبال یک برنامه‌نویس ارشد PHP با تجربه برای پیوستن به تیم خود هستیم. اگر به چالش‌های پیچیده علاقه‌مند هستید و می‌خواهید در یک محیط پویا کار کنید، این فرصت را از دست ندهید.',
        requirements: [
            'حداقل 5 سال تجربه در توسعه PHP',
            'تسلط کامل بر Laravel یا Symfony',
            'آشنایی با مفاهیم SOLID و Clean Code',
            'تجربه کار با پایگاه داده MySQL',
            'آشنایی با Git',
        ],
        salary: '15,000,000 - 25,000,000 تومان',
        postedDate: '2023-10-27',
        category: 'برنامه‌نویسی',
        tags: ['PHP', 'Laravel', 'MySQL', 'Git', 'Backend']
    },
    {
        id: '2',
        title: 'توسعه‌دهنده فرانت‌اند React',
        companyId: '2', // استارت‌آپ ب
        location: 'اصفهان',
        description: 'ما در استارت‌آپ خود به دنبال یک توسعه‌دهنده فرانت‌اند ماهر هستیم تا به تیم ما بپیوندد و در توسعه رابط کاربری محصولات ما نقش داشته باشد.',
        requirements: [
            'حداقل 3 سال تجربه در توسعه React',
            'تسلط بر JavaScript و TypeScript',
            'آشنایی با Next.js',
            'تجربه کار با Redux یا Zustand',
            'آشنایی با مفاهیم UI/UX',
        ],
        salary: '12,000,000 - 20,000,000 تومان',
        postedDate: '2023-10-20',
        category: 'برنامه‌نویسی',
        tags: ['React', 'JavaScript', 'Next.js', 'Frontend', 'UI/UX']
    },
    {
        id: '3',
        title: 'کارشناس سئو',
        companyId: '3', // آژانس دیجیتال مارکتینگ ج
        location: 'تهران',
        description: 'آژانس دیجیتال مارکتینگ ما به دنبال یک کارشناس سئو با تجربه است تا به بهبود رتبه وب‌سایت مشتریان ما کمک کند.',
        requirements: [
            'حداقل 2 سال تجربه در سئو',
            'آشنایی با ابزارهای Google Analytics و Google Search Console',
            'تسلط بر سئو داخلی و خارجی',
            'آشنایی با مفاهیم بازاریابی محتوا',
            'توانایی تحلیل داده و ارائه گزارش',
        ],
        salary: '8,000,000 - 15,000,000 تومان',
        postedDate: '2023-10-15',
        category: 'مارکتینگ',
        tags: ['SEO', 'Google Analytics', 'Digital Marketing', 'Content Marketing']
    },
      {
        id: '4',
        title: 'مدیر محصول',
        companyId: '4', // شرکت دانش بنیان د
        location: 'مشهد',
        description: 'به یک مدیر محصول خلاق و با انگیزه برای هدایت تیم محصول خود نیازمندیم. اگر تجربه مدیریت چرخه حیات محصول را دارید، جای شما در تیم ما خالی است.',
        requirements: [
            'حداقل 5 سال تجربه در مدیریت محصول',
            'توانایی تعریف و اولویت‌بندی نیازمندی‌های محصول',
            'آشنایی با متدولوژی‌های Agile و Scrum',
            'تجربه کار با تیم‌های توسعه فنی و بازاریابی',
            'مهارت‌های ارتباطی و رهبری قوی',
        ],
        salary: '20,000,000 - 30,000,000 تومان',
        postedDate: '2023-10-29',
        category: 'مدیریت',
          tags: ['Product Management', 'Agile', 'Scrum', 'Leadership']
    },
    {
        id: '5',
        title: 'طراح UI/UX',
        companyId: '5', // شرکت نرم افزاری ه
        location: 'شیراز',
        description: 'ما به دنبال یک طراح UI/UX با ذوق هنری و تجربه کافی برای طراحی رابط کاربری جذاب و کاربردی برای محصولات خود هستیم.',
        requirements: [
            'حداقل 3 سال تجربه در طراحی UI/UX',
            'تسلط بر ابزارهای طراحی مانند Figma یا Adobe XD',
            'آشنایی با اصول طراحی بصری و تعامل',
            'توانایی انجام تست کاربردپذیری',
            'آشنایی با HTML، CSS و JavaScript مزیت محسوب می شود.',
        ],
        salary: '10,000,000 - 18,000,000 تومان',
        postedDate: '2023-11-02',
        category: 'طراحی',
        tags: ['UI', 'UX', 'Figma', 'Adobe XD', 'Design']
    },
    {
        id: '6',
        title: 'کارشناس شبکه',
        companyId: '6', // شرکت فناوری اطلاعات و ارتباطات و
        location: 'تبریز',
        description: 'در شرکت ما، به یک کارشناس شبکه با تجربه برای مدیریت و نگهداری زیرساخت شبکه خود نیازمندیم.',
        requirements: [
            'حداقل 4 سال تجربه در مدیریت شبکه',
            'تسلط بر مفاهیم شبکه و پروتکل های TCP/IP',
            'آشنایی با تجهیزات شبکه مانند روترها و سوییچ ها',
            'تجربه کار با سیستم عامل های Windows Server و Linux',
            'دارا بودن مدارک CCNA یا CCNP مزیت محسوب می شود.',
        ],
        salary: '12,000,000 - 22,000,000 تومان',
        postedDate: '2023-11-04',
        category: 'شبکه',
        tags: ['Network', 'TCP/IP', 'Windows Server', 'Linux', 'CCNA']
    },
      {
        id: '7',
        title: 'برنامه نویس Go',
        companyId: '7', // شرکت داده پردازی ز
        location: 'تهران',
        description: 'به یک برنامه نویس Go با تجربه و علاقه مند به یادگیری فناوری های جدید برای توسعه بک اند سیستم های خود نیازمندیم.',
        requirements: [
            'حداقل 2 سال تجربه برنامه نویسی با Go',
            'آشنایی با مفاهیم Concurrency و Goroutines',
            'تجربه کار با پایگاه داده های SQL و NoSQL',
            'آشنایی با RESTful APIs',
            'آشنایی با Docker و Kubernetes مزیت محسوب می شود.', // Fix: Removed extra space
        ],
        salary: '18,000,000 - 28,000,000 تومان',
        postedDate: '2023-11-07',
        category: 'برنامه نویسی',
        tags: ['Go', 'Golang', 'Backend', 'SQL', 'NoSQL']
    },
    {
        id: '8',
        title: 'کارشناس دیجیتال مارکتینگ',
        companyId: '8',  // شرکت تبلیغاتی ح
        location: 'کرج',
        description: 'به یک کارشناس دیجیتال مارکتینگ خلاق و با تجربه برای مدیریت کمپین های تبلیغاتی آنلاین خود نیازمندیم.',
        requirements: [
            'حداقل 3 سال تجربه در دیجیتال مارکتینگ',
            'تسلط بر پلتفرم های تبلیغاتی مانند Google Ads و شبکه های اجتماعی',
            'آشنایی با مفاهیم SEO، SEM و بازاریابی محتوا',
            'توانایی تحلیل داده و ارائه گزارش',
            'مهارت های ارتباطی قوی'
        ],
        salary: '10,000,000 - 18,000,000 تومان',
        postedDate: '2023-11-10',
        category: 'مارکتینگ',
        tags: ['Digital Marketing', 'Google Ads', 'SEO', 'SEM', 'Social Media']
    },
    {
        id: '9',
        title: 'حسابدار',
        companyId: '9', // شرکت بازرگانی ط
        location: 'یزد',
        description: 'به یک حسابدار دقیق و منظم با تجربه کافی برای مدیریت امور مالی شرکت خود نیازمندیم.',
        requirements: [
            'حداقل 4 سال تجربه در حسابداری',
            'تسلط بر اصول حسابداری و قوانین مالیاتی',
            'آشنایی با نرم افزارهای حسابداری',
            'دقت و توجه بالا به جزئیات',
            'مهارت های تحلیلی و حل مسئله'
        ],
        salary: '8,000,000 - 15,000,000 تومان',
        postedDate: '2023-11-12',
        category: 'حسابداری',
        tags: ['Accounting', 'Finance', 'Tax', 'Bookkeeping']
    },
    {
        id: '10',
        title: 'مدیر فروش',
        companyId: '10', // شرکت تولیدی ی
        location: 'ارومیه',
        description: 'به یک مدیر فروش با تجربه و توانمند برای رهبری تیم فروش و توسعه بازار خود نیازمندیم.',
        requirements: [
            'حداقل 5 سال تجربه در مدیریت فروش',
            'توانایی برنامه ریزی و اجرای استراتژی های فروش',
            'مهارت های مذاکره و متقاعدسازی قوی',
            'توانایی رهبری و ایجاد انگیزه در تیم',
            'آشنایی با صنعت مربوطه مزیت محسوب می شود.'
        ],
        salary: '15,000,000 - 25,000,000 تومان + پورسانت',
        postedDate: '2023-11-14',
        category: 'فروش',
        tags: ['Sales', 'Management', 'Leadership', 'Business Development']
    }
];

const mockCompanies: Company[] = [
  {
    id: '1',
    name: 'شرکت نرم‌افزاری الف',
    description: 'شرکت نرم‌افزاری الف یک شرکت پیشرو در زمینه توسعه نرم‌افزارهای سازمانی است. ما با تیمی از متخصصان با تجربه، به ارائه راهکارهای نرم‌افزاری نوآورانه به مشتریان خود می‌پردازیم.',
    website: 'https://www.example.com/alef',
    logo: 'https://via.placeholder.com/150', // Replace with actual logo URL
  },
  {
    id: '2',
    name: 'استارت‌آپ ب',
    description: 'استارت‌آپ ب یک استارت‌آپ نوپا در حوزه فناوری اطلاعات است. ما در تلاش هستیم تا با ارائه محصولات خلاقانه، زندگی را برای مردم آسان‌تر کنیم.',
    website: 'https://www.example.com/beh',
    logo: 'https://via.placeholder.com/150',  // Replace with actual logo URL
  },
  {
      id: '3',
      name: 'آژانس دیجیتال مارکتینگ ج',
      description: 'آژانس دیجیتال مارکتینگ ج با ارائه خدمات جامع دیجیتال مارکتینگ به کسب و کارها کمک می کند تا در دنیای آنلاین بدرخشند.',
      website: 'https://www.example.com/jim',
      logo: 'https://via.placeholder.com/150',
  },
    {
        id: '4',
        name: 'شرکت دانش بنیان د',
        description: 'شرکت دانش بنیان د، با تکیه بر دانش و نوآوری، در زمینه تولید محصولات دانش بنیان فعالیت می کند.',
        website: 'https://www.example.com/dal',
        logo: 'https://via.placeholder.com/150',
    },
    {
        id: '5',
        name: 'شرکت نرم افزاری ه',
        description: 'شرکت نرم افزاری ه، با ارائه راهکارهای نرم افزاری سفارشی، به نیازهای خاص مشتریان خود پاسخ می دهد.',
        website: 'https://www.example.com/he',
        logo: 'https://via.placeholder.com/150',
    },
    {
        id: '6',
        name: 'شرکت فناوری اطلاعات و ارتباطات و',
        description: 'شرکت فناوری اطلاعات و ارتباطات و، ارائه دهنده خدمات جامع در زمینه فناوری اطلاعات و ارتباطات.',
        website: 'https://www.example.com/vav',
        logo: 'https://via.placeholder.com/150',
    },
    {
        id: '7',
        name: 'شرکت داده پردازی ز',
        description: 'شرکت داده پردازی ز، متخصص در ارائه راهکارهای داده محور و هوش مصنوعی.',
        website: 'https://www.example.com/zay',
        logo: 'https://via.placeholder.com/150',
    },
    {
        id: '8',
        name: 'شرکت تبلیغاتی ح',
        description: 'شرکت تبلیغاتی ح، با ارائه خدمات خلاقانه تبلیغاتی، به برندها کمک می کند تا دیده شوند.',
        website: 'https://www.example.com/he2',
        logo: 'https://via.placeholder.com/150',
    },
    {
        id: '9',
        name: 'شرکت بازرگانی ط',
        description: 'شرکت بازرگانی ط، فعال در زمینه واردات و صادرات انواع کالا.',
        website: 'https://www.example.com/te',
        logo: 'https://via.placeholder.com/150',
    },
    {
         id: '10',
        name: 'شرکت تولیدی ی',
        description: 'شرکت تولیدی ی، تولید کننده انواع محصولات با کیفیت بالا.',
        website: 'https://www.example.com/ye',
        logo: 'https://via.placeholder.com/150',
    }
];

const jobCategories = [
    "برنامه‌نویسی",
    "مارکتینگ",
    "مدیریت",
    "طراحی",
    "شبکه",
    "حسابداری",
    "فروش",
];

// Animation Variants
const cardVariants = { // Unified variant for JobCard and CompanyCard
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.2 } },
};

const TagVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.2 } },
    exit: { opacity: 0, x: 10, transition: { duration: 0.1 } },
};

const ModalVariants = {  // Unified variant for modals
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.3, type: 'spring', stiffness: 120 } },
    exit: { opacity: 0, scale: 0.8, transition: { duration: 0.2 } },
};

// Helper Components
const Tag = ({ tag, onRemove, isRemovable }: { tag: string; onRemove?: (tag: string) => void; isRemovable?: boolean }) => (
    <motion.div
        variants={TagVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className={cn(
            "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium",
            "bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100",
            "mr-2 mb-2"
        )}
    >
        {tag}
        {isRemovable && onRemove && (
            <button
                onClick={() => onRemove(tag)}
                className="ml-1 focus:outline-none"
            >
                <XCircle className="h-4 w-4 text-blue-500 hover:text-blue-700" />
            </button>
        )}
    </motion.div>
);

// Unified Card Component
const AppCard = ({
    children,
    onClick,
    isInteractive
}: {
    children: React.ReactNode,
    onClick?: () => void,
    isInteractive?: boolean
}) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <motion.div
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className={cn(
                "bg-white rounded-lg shadow-md p-4 transition-all duration-300",
                isInteractive && "hover:shadow-lg hover:scale-[1.01] cursor-pointer",
                isHovered && isInteractive && "border-2 border-blue-500/50" // Conditional border
            )}
            onClick={onClick}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {children}
        </motion.div>
    );
};

const JobCard = ({ job, onSelect }: { job: Job; onSelect: (job: Job) => void }) => {
    const company = mockCompanies.find(c => c.id === job.companyId);

  return (
    <AppCard onClick={() => onSelect(job)} isInteractive>
      <div className="flex justify-between items-start gap-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{job.title}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">{company ? company.name : 'نام شرکت موجود نیست'}</p>
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-300 mt-1">
            <MapPin className="w-4 h-4 mr-1" />
            <span>{job.location}</span>
          </div>
        </div>
      </div>
      <div className="mt-2">
        {job.tags.map((tag) => (
          <Tag key={tag} tag={tag} />
        ))}
      </div>
      <p className="text-sm text-gray-700 dark:text-gray-200 mt-2 whitespace-pre-line">
        {job.description.substring(0, 100)}...
      </p>
      <div className="mt-4 flex justify-between items-center">
        <span className="text-sm font-medium text-gray-900 dark:text-white">
          {job.salary}
        </span>
        <span className="text-xs text-gray-500 dark:text-gray-400">
          {format(new Date(job.postedDate), 'PPP', { locale: enUS })}
        </span>
      </div>
    </AppCard>
  );
};

const CompanyCard = ({ company, onSelect }: { company: Company, onSelect: (company: Company) => void }) => {
    return (
        <AppCard onClick={() => onSelect(company)} isInteractive>
            <div className="flex items-center gap-4">
                <img src={company.logo} alt={company.name} className="w-16 h-16 rounded-full object-cover" loading="lazy"/>
                <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{company.name}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 whitespace-pre-line">{company.description.substring(0, 50)}...</p>
                    <a href={company.website} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-500 hover:underline">
                        Website
                    </a>
                </div>
            </div>
        </AppCard>
    );
};

const JobDetailsModal = ({ job, onClose }: { job: Job | null; onClose: () => void }) => {
    if (!job) return null;
    const company = mockCompanies.find(c => c.id === job.companyId);

    return (
      <Dialog open={!!job} onOpenChange={() => onClose()}>
        <AnimatePresence>
          {job && (
            <DialogContent
              as={motion.div}
              variants={ModalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="sm:max-w-2xl w-full max-h-[80vh] overflow-y-auto sm:mx-2" // Added max-h and overflow, added sm:mx-2
            >
              <DialogHeader>
                <DialogTitle className="text-gray-900 dark:text-white">{job.title}</DialogTitle>
                <DialogDescription className="text-gray-500 dark:text-gray-400">
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{company ? company.name: 'نام شرکت موجود نیست'}</p>
                      <div className="flex items-center text-sm text-gray-600 dark:text-gray-300 mt-1">
                        <MapPin className="w-4 h-4 mr-1" />
                        <span>{job.location}</span>
                      </div>
                    </div>
                  </div>
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white">توضیحات شغل</h4>
                  <p className="text-gray-700 dark:text-gray-200 whitespace-pre-line">{job.description}</p>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white">الزامات</h4>
                  <ul className="list-disc list-inside text-gray-700 dark:text-gray-200 space-y-1">
                    {job.requirements.map((req, index) => (
                      <li key={index}>{req}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white">حقوق</h4>
                  <p className="text-gray-900 dark:text-white font-medium">{job.salary}</p>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white">تگ ها</h4>
                  <div className="flex flex-wrap">
                    {job.tags.map((tag) => (
                      <Tag key={tag} tag={tag} />
                    ))}
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline"onClic