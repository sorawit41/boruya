// Register.jsx
import React, { useState, useRef, useCallback, useEffect } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';
import { supabase } from './supabaseClient'; // ตรวจสอบว่า path ถูกต้อง
import { FiUploadCloud, FiFileText, FiX, FiBriefcase, FiUser, FiInfo, FiPaperclip, FiCheckCircle, FiAlertTriangle } from 'react-icons/fi';

// --- Constants ---
const RECAPTCHA_SITE_KEY = '6LfTxV8rAAAAAIL8kp_sqm6KAUzrpo2UFgW-BcPC';

const jobPositions = [
    {
      value: "หัวหน้าเชฟ",
      label: "หัวหน้าเชฟ (Head Chef)",
      qualifications: ["มีประสบการณ์ จะพิจารณาเป็นพิเศษ", "สร้างสรรค์เมนูใหม่ๆ และควบคุมต้นทุนได้ดี", "มีความเป็นผู้นำ บริหารทีมได้", "ใส่ใจความสะอาดและมาตรฐานของอาหาร", "กระตือรือร้น พร้อมเรียนรู้ และทำงานเป็นทีมได้ดี", "ขยัน, ซื่อสัตย์ และอดทน"],
      benefits: ["เงินเดือน 23,000++ (หรือตามตกลง)", "ประกันสังคม", "มีโอที", "วันหยุดประจำสัปดาห์"],
      work_schedule: { title: "เวลาทำงาน", shifts: ["ทำงาน 6 วัน/สัปดาห์ (วันละ 8 ชั่วโมง)", "ทำงานเป็นกะ"], note: "✨ มีความยืดหยุ่นเรื่องเวลาทำงาน จะพิจารณาเป็นพิเศษ" }
    },
    {
      value: "ผู้ช่วยเชฟ",
      label: "ผู้ช่วยเชฟ (Assistant Chef)",
      qualifications: ["มีประสบการณ์ในครัวจะพิจารณาเป็นพิเศษ", "มีความกระตือรือร้น พร้อมเรียนรู้งาน และทำงานเป็นทีมได้ดี", "ขยัน, ซื่อสัตย์ และอดทน"],
      benefits: ["เงินเดือน 20,000++", "ประกันสังคม", "มีโอที", "มีโอกาสเรียนรู้และเติบโต"],
      work_schedule: { title: "เวลาทำงาน", shifts: ["ทำงาน 6 วัน/สัปดาห์ (วันละ 8 ชั่วโมง)", "ทำงานเป็นกะ"], note: "✨ มีความยืดหยุ่นเรื่องเวลาทำงาน จะพิจารณาเป็นพิเศษ" }
    },
    {
        value: "ผู้จัดการร้าน",
        label: "ผู้จัดการร้าน (Restaurant Manager)",
        qualifications: ["มีประสบการณ์จะพิจารณาเป็นพิเศษ", "มีทักษะบริหารจัดการบุคลากร, สต็อก, ยอดขาย", "มีใจรักงานบริการและแก้ปัญหาเฉพาะหน้าได้ดี", "สื่อสารภาษาอังกฤษได้จะพิจารณาเป็นพิเศษ", "ขยัน, ซื่อสัตย์ และอดทน"],
        benefits: ["เงินเดือน 25,000++", "ค่าคอมมิชชั่น", "ประกันสังคม", "มีโอที", "โบนัสปีละ 2 ครั้ง", "วันหยุดประจำสัปดาห์"],
        work_schedule: { title: "เวลาทำงาน", shifts: ["ทำงาน 6 วัน/สัปดาห์ (วันละ 8 ชั่วโมง)", "เข้างานเป็นกะและดูแลจนปิดร้านได้"], note: "✨ มีความยืดหยุ่นเรื่องเวลาทำงาน จะพิจารณาเป็นพิเศษ" }
    },
    {
        value: "ผู้ช่วยผู้จัดการร้าน",
        label: "ผู้จัดการร้าน (Assitant Restaurant Manager)",
        qualifications: ["มีประสบการณ์จะพิจารณาเป็นพิเศษ", "มีทักษะบริหารจัดการบุคลากร, สต็อก, ยอดขาย", "มีใจรักงานบริการและแก้ปัญหาเฉพาะหน้าได้ดี", "สื่อสารภาษาอังกฤษได้จะพิจารณาเป็นพิเศษ", "ขยัน, ซื่อสัตย์ และอดทน"],
        benefits: ["เงินเดือน 20,000++", "ค่าคอมมิชชั่น", "ประกันสังคม", "มีโอที", "โบนัสปีละ 2 ครั้ง", "วันหยุดประจำสัปดาห์"],
        work_schedule: { title: "เวลาทำงาน", shifts: ["ทำงาน 6 วัน/สัปดาห์ (วันละ 8 ชั่วโมง)", "เข้างานเป็นกะและดูแลจนปิดร้านได้"], note: "✨ มีความยืดหยุ่นเรื่องเวลาทำงาน จะพิจารณาเป็นพิเศษ" }
    },
    {
        value: "สจ๊วต/พนักงานล้านจาน",
        label: "สจ๊วต/พนักงานล้านจาน",
        qualifications: ["ไม่จำเป็นต้องมีประสบการณ์", "ทำงานเป็นทีมได้ดี", "มีใจรักงานบริการและแก้ปัญหาเฉพาะหน้าได้ดี", "สื่อสารภาษาอังกฤษได้จะพิจารณาเป็นพิเศษ", "ขยัน, ซื่อสัตย์ และอดทน"],
        benefits: ["เงินเดือน 13,000++", "ค่าคอมมิชชั่น", "ประกันสังคม", "มีโอที", "โบนัสปีละ 2 ครั้ง", "วันหยุดประจำสัปดาห์"],
        work_schedule: { title: "เวลาทำงาน", shifts: ["ทำงาน 6 วัน/สัปดาห์ (วันละ 8 ชั่วโมง)", "เข้างานเป็นกะและดูแลจนปิดร้านได้"], note: "✨ มีความยืดหยุ่นเรื่องเวลาทำงาน จะพิจารณาเป็นพิเศษ" }
    },
    {
        value: "พนักงานเสิร์ฟ",
        label: "พนักงานเสิร์ฟ (Waiter/Waitress)",
        qualifications: ["บุคลิกดี ยิ้มแย้ม มีใจรักบริการ", "รับผิดชอบและตรงต่อเวลา", "ไม่จำเป็นต้องมีประสบการณ์", "ทำงานเป็นทีมได้ดี", "ขยัน, ซื่อสัตย์ และอดทน"],
        benefits: ["เงินเดือน 12,000++", "ประกันสังคม", "วันหยุดประจำสัปดาห์"],
        work_schedule: { title: "เวลาทำงาน", shifts: ["ทำงาน 6 วัน/สัปดาห์ (วันละ 8 ชั่วโมง)", "ทำงานเป็นกะ"], note: "✨ ทำงานกะดึกได้ จะพิจารณาเป็นพิเศษ" }
    },
    //พาร์ทไทม์ (Part-Time)
    {
        value: "พาร์ทไทม์ (Part-Time)",
        label: "พาร์ทไทม์ (Part-Time)",
        qualifications: ["บุคลิกดี ยิ้มแย้ม มีใจรักบริการ", "รับผิดชอบและตรงต่อเวลา", "ไม่จำเป็นต้องมีประสบการณ์", "ทำงานเป็นทีมได้ดี", "ขยัน, ซื่อสัตย์ และอดทน"],
        benefits: ["รายได้เริ่มต้นชั่วโมงละ 50 บาท (รับเงินรายวัน!)"],
        work_schedule: { title: "เวลาทำงาน", shifts: ["ทำงาน ตามตาราง วัน/สัปดาห์ (วันละ 8 ชั่วโมง)", "ทำงานเป็นกะ"], note: "✨ ทำงานกะดึกได้ จะพิจารณาเป็นพิเศษ" }
    },
    { value: "other", label: "อื่นๆ (Other)" },
];

const heardFromOptions = [
    { name: 'facebook', label: 'Facebook' }, { name: 'instagram', label: 'Instagram' }, { name: 'tiktok', label: 'TikTok' },
    { name: 'website', label: 'Website' }, { name: 'storefront', label: 'หน้าร้าน' }, { name: 'other', label: 'อื่นๆ' },
];

const initialFormState = {
    fullName: '', nickname: '', phoneNumber: '', email: '', age: '',
    educationStatus: '', positionApplied: '', otherPosition: '', experience: '',
    heardFrom: { facebook: false, instagram: false, tiktok: false, website: false, storefront: false, other: false },
    heardFromOtherText: '', recaptchaToken: '',
};

// --- Reusable Components ---

const FormInput = React.memo(({ id, name, label, required, ...props }) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-slate-700 mb-1">
      {label} {required && <span className="text-red-600">*</span>}
    </label>
    <input
      id={id}
      name={name}
      required={required}
      className="mt-1 block w-full px-4 py-2 bg-white border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500 transition duration-150"
      {...props}
    />
  </div>
));

const FileUploadArea = React.memo(({ files, onRemove, onPreview, handleFileChange, fileInputRef }) => (
    <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">อัปโหลด Resume หรือ รูปถ่าย (ไม่บังคับ)</label>
        {files.length > 0 && (
            <div className="space-y-2 mb-4">
                {files.map((file, index) => (
                    <div key={index} className="flex items-center justify-between bg-slate-50 border border-slate-200 p-2 rounded-md group">
                        <button type="button" onClick={() => onPreview(file)} className="flex items-center space-x-2 overflow-hidden text-left cursor-pointer">
                            {file.type.startsWith('image/') ? (
                                <img src={file.preview} alt={file.name} className="h-8 w-8 object-cover rounded-md flex-shrink-0" />
                            ) : (
                                <FiPaperclip className="h-6 w-6 text-slate-500 flex-shrink-0" />
                            )}
                            <span className="text-sm text-slate-700 truncate group-hover:text-red-600">{file.name}</span>
                        </button>
                        <button type="button" onClick={() => onRemove(index)} className="p-1 text-slate-500 hover:text-red-600 rounded-full hover:bg-red-100">
                            <FiX className="h-4 w-4" />
                        </button>
                    </div>
                ))}
            </div>
        )}
        <div className="mt-1 flex justify-center px-6 pt-8 pb-8 border-2 border-slate-300 border-dashed rounded-lg bg-white hover:border-red-400 transition-colors">
            <div className="space-y-1 text-center">
                <FiUploadCloud className="mx-auto h-10 w-10 text-slate-400" />
                <div className="flex text-sm text-slate-600">
                    <label htmlFor="file-upload" className="relative cursor-pointer rounded-md font-medium text-red-600 hover:text-red-700">
                        <span>เลือกไฟล์</span>
                        <input id="file-upload" name="resumeFile" type="file" multiple ref={fileInputRef} className="sr-only" onChange={handleFileChange} accept=".pdf,.doc,.docx,image/jpeg,image/png,image/webp" />
                    </label>
                    <p className="pl-1">หรือลากมาวาง</p>
                </div>
                <p className="text-xs text-slate-500">สามารถเลือกได้หลายไฟล์ (สูงสุด 5MB ต่อไฟล์)</p>
            </div>
        </div>
    </div>
));

const FormSection = ({ icon: Icon, title, children }) => (
    <div className="pt-10 first:pt-0">
        <div className="flex items-center mb-6">
            <Icon className="h-6 w-6 text-red-600" />
            <h3 className="text-lg font-bold text-slate-800 ml-3">{title}</h3>
        </div>
        <div className="space-y-6">
            {children}
        </div>
    </div>
);


// --- Main Register Component ---
const Register = () => {
    const [formData, setFormData] = useState(initialFormState);
    const [heardFrom, setHeardFrom] = useState(initialFormState.heardFrom);
    const [heardFromOtherText, setHeardFromOtherText] = useState('');
    const [resumeFiles, setResumeFiles] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState({ message: '', type: '' });
    const [modalImage, setModalImage] = useState(null); 

    const recaptchaRef = useRef();
    const fileInputRef = useRef(null);

    const handleChange = useCallback((e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    }, []);

    const handleRecaptchaChange = useCallback((token) => {
        setFormData(prev => ({ ...prev, recaptchaToken: token }));
        if (token) setSubmitStatus({ message: '', type: '' });
    }, []);

    const handleHeardFromChange = useCallback((e) => {
        const { name, checked } = e.target;
        setHeardFrom(prev => ({ ...prev, [name]: checked }));
    }, []);

    const handleFileChange = useCallback((e) => {
        const selectedFiles = e.target.files ? Array.from(e.target.files) : [];
        if (selectedFiles.length === 0) return;

        const newFiles = selectedFiles.map(file => {
            if (file.size > 5 * 1024 * 1024) {
                setSubmitStatus({ message: `ไฟล์ ${file.name} มีขนาดใหญ่เกิน 5MB`, type: 'error' });
                return null;
            }
            return Object.assign(file, {
                preview: URL.createObjectURL(file)
            });
        }).filter(file => file !== null);

        setResumeFiles(prevFiles => [...prevFiles, ...newFiles]);
    }, []);

    const handleRemoveFile = useCallback((indexToRemove) => {
        setResumeFiles(prevFiles => {
            const fileToRemove = prevFiles[indexToRemove];
            if (fileToRemove.preview) {
                URL.revokeObjectURL(fileToRemove.preview);
            }
            return prevFiles.filter((_, index) => index !== indexToRemove);
        });
    }, []);

    const handlePreviewClick = useCallback((file) => {
        if (file.type.startsWith('image/')) {
            setModalImage(file.preview); 
        } else {
            window.open(file.preview, '_blank'); 
        }
    }, []);


    useEffect(() => {
        return () => {
            resumeFiles.forEach(file => {
                if (file.preview) {
                    URL.revokeObjectURL(file.preview);
                }
            });
        };
    }, [resumeFiles]);
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitStatus({ message: '', type: '' });

        if (!formData.recaptchaToken) { setSubmitStatus({ message: 'กรุณายืนยันว่าคุณไม่ใช่โปรแกรมอัตโนมัติ', type: 'error' }); return; }
        if (formData.positionApplied === 'other' && !formData.otherPosition.trim()) { setSubmitStatus({ message: 'กรุณาระบุตำแหน่งงานอื่นๆ ที่สนใจ', type: 'error' }); return; }
        
        setIsSubmitting(true);
        try {
            const uploadPromises = resumeFiles.map(file => {
                const fileExt = file.name.split('.').pop();
                const sanitizedFullName = formData.fullName.replace(/[^a-zA-Z0-9\s]/g, '').trim();
                const safeFileNameBase = (sanitizedFullName.replace(/\s+/g, '_') || 'user');
                const newFileName = `${safeFileNameBase}-${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${fileExt}`;
                return supabase.storage.from('job-app-resumes').upload(newFileName, file);
            });

            const uploadResults = await Promise.all(uploadPromises);
            
            const resume_urls = uploadResults.map(result => {
                if (result.error) {
                    throw new Error(`Upload failed: ${result.error.message}`);
                }
                return supabase.storage.from('job-app-resumes').getPublicUrl(result.data.path).data.publicUrl;
            });
            
            const sources = Object.keys(heardFrom).filter(key => heardFrom?.[key]).map(key => {
                if (key === 'other' && heardFromOtherText) return `อื่นๆ: ${heardFromOtherText}`;
                return heardFromOptions.find(opt => opt.name === key)?.label || key;
            });
            
            const submissionData = {
                full_name: formData.fullName,
                nickname: formData.nickname,
                phone_number: formData.phoneNumber,
                email: formData.email,
                age: formData.age ? parseInt(formData.age, 10) : null,
                education_status: formData.educationStatus,
                experience: formData.experience,
                position_applied: formData.positionApplied === 'other' ? formData.otherPosition : formData.positionApplied,
                resume_urls: resume_urls.length > 0 ? resume_urls : null,
                heard_from_sources: sources.length > 0 ? sources : null,
            };

            const { error } = await supabase.from('job_applications').insert([submissionData]);
            if (error) {
                throw error;
            }
            
            setSubmitStatus({ message: 'ส่งใบสมัครเรียบร้อย! ทีมงานจะตรวจสอบข้อมูลและติดต่อกลับเพื่อทำการนัดสัมภาษณ์ในเร็วๆ นี้ ขอบคุณที่สนใจร่วมงานกับเรา', type: 'success' });
            setFormData(initialFormState);
            setHeardFrom(initialFormState.heardFrom);
            setHeardFromOtherText('');
            setResumeFiles([]);
            recaptchaRef.current?.reset();
        } catch (error) {
            console.error('Submission Error:', error);
            setSubmitStatus({ message: `การส่งใบสมัครล้มเหลว: ${error.message}`, type: 'error' });
        } finally {
            setIsSubmitting(false);
        }
    };
    const selectedJobDetails = jobPositions.find(p => p.value === formData.positionApplied);
    
    return (
        <div className="min-h-screen bg-white py-12 sm:py-16 font-sans">
            <main className="w-full max-w-3xl mx-auto px-4">
                <div className="bg-white p-8 sm:p-10 rounded-xl shadow-2xl w-full border border-slate-200">
                    <div className="text-center mb-10">
                        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">ร่วมงานกับเรา</h1>
                        <p className="mt-3 text-base text-slate-500">กรอกแบบฟอร์มเพื่อสมัครตำแหน่งงานที่คุณสนใจ</p>
                    </div>
                    
                    <form onSubmit={handleSubmit} className="">
                        <FormSection icon={FiUser} title="ข้อมูลผู้สมัคร">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">
                                <FormInput id="fullName" name="fullName" label="ชื่อ-นามสกุล" value={formData.fullName} onChange={handleChange} required placeholder="สมชาย ใจดี" />
                                <FormInput id="nickname" name="nickname" label="ชื่อเล่น" value={formData.nickname} onChange={handleChange} required placeholder="ชาย" />
                                <FormInput id="email" name="email" label="อีเมล" type="email" value={formData.email} onChange={handleChange} required placeholder="you@example.com" />
                                <FormInput id="phoneNumber" name="phoneNumber" label="เบอร์โทรศัพท์" type="tel" value={formData.phoneNumber} onChange={handleChange} required placeholder="08xxxxxxxx" />
                                <FormInput id="age" name="age" label="อายุ" type="number" value={formData.age} onChange={handleChange} required min="18" placeholder="เช่น 25" />
                                
                                {/* --- MODIFIED: เปลี่ยนกลับเป็นช่องกรอกข้อความตามเดิม --- */}
                                <FormInput 
                                    id="educationStatus" 
                                    name="educationStatus" 
                                    label="การศึกษา" 
                                    value={formData.educationStatus} 
                                    onChange={handleChange} 
                                    placeholder="เช่น ปริญญาตรี, กำลังศึกษา" 
                                />
                         

                            </div>
                        </FormSection>

                        <FormSection icon={FiBriefcase} title="ข้อมูลการสมัครงาน">
                            <select name="positionApplied" id="positionApplied" value={formData.positionApplied} onChange={handleChange} required className="block w-full pl-3 pr-10 py-2.5 border border-slate-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500 sm:text-sm transition">
                                <option value="" disabled>-- กรุณาเลือกตำแหน่ง --</option>
                                {jobPositions.map(pos => <option key={pos.value} value={pos.value}>{pos.label}</option>)}
                            </select>
                            
                            {selectedJobDetails && selectedJobDetails.value !== 'other' && (
                                <div className="p-5 bg-slate-50 border border-slate-200 rounded-lg text-sm transition-all duration-300">
                                    <h4 className="font-bold text-md text-red-800 mb-4">รายละเอียดตำแหน่ง: {selectedJobDetails.label}</h4>
                                    {selectedJobDetails.qualifications?.length > 0 && <div className="mb-4"><h5 className="font-semibold text-slate-700 mb-2">คุณสมบัติ</h5><ul className="list-disc list-inside text-slate-600 space-y-1.5">{selectedJobDetails.qualifications.map((item, i) => <li key={`q-${i}`}>{item}</li>)}</ul></div>}
                                    {selectedJobDetails.benefits?.length > 0 && <div className="mb-4"><h5 className="font-semibold text-slate-700 mb-2">สวัสดิการ</h5><ul className="list-disc list-inside text-slate-600 space-y-1.5">{selectedJobDetails.benefits.map((item, i) => <li key={`b-${i}`}>{item}</li>)}</ul></div>}
                                    {selectedJobDetails.work_schedule && <div><h5 className="font-semibold text-slate-700 mb-2">{selectedJobDetails.work_schedule.title}</h5><ul className="list-disc list-inside text-slate-600 space-y-1.5">{selectedJobDetails.work_schedule.shifts.map((s, i) => <li key={`s-${i}`}>{s}</li>)}</ul>{selectedJobDetails.work_schedule.note && <p className="mt-3 text-sm font-medium text-red-600">{selectedJobDetails.work_schedule.note}</p>}</div>}
                                </div>
                            )}

                            {formData.positionApplied === 'other' && (
                                <FormInput id="otherPosition" name="otherPosition" label="กรุณาระบุตำแหน่งอื่น ๆ" value={formData.otherPosition} onChange={handleChange} required placeholder="ระบุตำแหน่ง..." />
                            )}

                            <textarea name="experience" id="experience" rows="4" value={formData.experience} onChange={handleChange} className="block w-full px-4 py-2 bg-white border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500 transition" placeholder="เล่าประสบการณ์ที่เกี่ยวข้องกับตำแหน่งที่สมัคร... (ถ้ามี)"></textarea>
                            
                            <FileUploadArea files={resumeFiles} onRemove={handleRemoveFile} onPreview={handlePreviewClick} handleFileChange={handleFileChange} fileInputRef={fileInputRef} />
                        </FormSection>

                        <FormSection icon={FiInfo} title="ช่องทางที่รู้จักเรา">
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-4">
                                {heardFromOptions.map((option) => (
                                    <div key={option.name} className="flex items-center">
                                        <input id={`heard-${option.name}`} name={option.name} type="checkbox" checked={heardFrom?.[option.name] || false} onChange={handleHeardFromChange} className="h-4 w-4 text-red-600 border-slate-300 rounded focus:ring-red-500" />
                                        <label htmlFor={`heard-${option.name}`} className="ml-3 block text-sm font-medium text-slate-700">{option.label}</label>
                                    </div>
                                ))}
                            </div>
                            {heardFrom?.other && (
                                <div className="mt-4">
                                    <FormInput id="heardFromOtherText" name="heardFromOtherText" label="โปรดระบุ" value={heardFromOtherText} onChange={(e) => setHeardFromOtherText(e.target.value)} placeholder="เช่น เพื่อนแนะนำ..." />
                                </div>
                            )}
                            
                            <div className="mt-6 pt-5 border-t border-slate-200">
                                <p className="text-center text-xs text-slate-500">
                                    <strong>หมายเหตุ:</strong> หากไม่สามารถส่งใบสมัครได้ กรุณาลองใช้เบราว์เซอร์ในโหมดไม่ระบุตัวตน (Incognito)
                                    <br />
                                    หรือติดต่อสอบถามที่เบอร์ 042 328 899 หรือ 089 553 5468
                                </p>
                            </div>

                        </FormSection>
                        
                        <div className="pt-10 space-y-6">
                            <div className="flex justify-center">
                                <ReCAPTCHA ref={recaptchaRef} sitekey={RECAPTCHA_SITE_KEY} onChange={handleRecaptchaChange} onExpired={() => handleRecaptchaChange(null)} />
                            </div>

                            {submitStatus.message && (
                                <div className={`flex items-start justify-center gap-x-3 text-sm ${submitStatus.type === 'success' ? 'text-green-700' : 'text-red-700'}`}>
                                    {submitStatus.type === 'success' 
                                        ? <FiCheckCircle className="h-5 w-5 mt-0.5 flex-shrink-0" /> 
                                        : <FiAlertTriangle className="h-5 w-5 mt-0.5 flex-shrink-0" />
                                    }
                                    <div className="text-left">
                                        <p className="font-medium">
                                            {submitStatus.message}
                                        </p>
                                    </div>
                                </div>
                            )}

                            <button type="submit" disabled={isSubmitting || !formData.recaptchaToken} className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-md text-base font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:bg-slate-400 disabled:cursor-not-allowed transition-all duration-300">
                                {isSubmitting ? 'กำลังส่งข้อมูล...' : 'ส่งใบสมัคร'}
                            </button>
                        </div>
                    </form>
                </div>
            </main>

            {/* Image Modal */}
            {modalImage && (
                <div 
                    className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4 transition-opacity duration-300" 
                    onClick={() => setModalImage(null)}
                >
                    <img 
                        src={modalImage} 
                        alt="Preview" 
                        className="max-w-full max-h-full rounded-lg shadow-2xl" 
                        onClick={(e) => e.stopPropagation()}
                    />
                    <button 
                        className="absolute top-4 right-4 text-white text-4xl font-bold"
                        onClick={() => setModalImage(null)}
                    >
                        &times;
                    </button>
                </div>
            )}
        </div>
    );
};

export default Register;