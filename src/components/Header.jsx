// src/components/Header.jsx

import React, { useState, useEffect, useCallback, Fragment } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Disclosure, Menu, Transition } from '@headlessui/react';
import { Bars3Icon, XMarkIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import { FaFacebook, FaInstagram, FaXTwitter } from 'react-icons/fa6';
import logoLightMode from '/src/assets/logo/Boruya Logo.png';

// --- Configuration ---
const navigation = [
    { 
        id: 1, name: "เกี่ยวกับ", href: "/#" 
        
    },
    { 
        id: 2, name: "อีเว้นท์", 
        children: [
            { id: 21, name: "กิจกรรมทางร้าน", href: "/NewsAndEvent" },
            { id: 22, name: "เกมส์ทางร้าน", href: "/Game" },
            { id: 23, name: "แลกคูปอง", href: "/Voucher" },
        ]
    },
    { id: 3, name: "รับสมัครพนักงาน", href: "/register" },
    { id: 4, name: "ติดต่อ", href: "/contact" },
    { id: 5, name: "เมนูอาหาร", href: "/Menu" },
    { 
        id: 6, name: "ข้อกำหนด", 
        children: [
            { id: 61, name: "ข้อกำหนดการให้บริการเว็ปไซต์", href: "/TermsOfService" },
            { id: 62, name: "นโยบายความเป็นส่วนตัว", href: "/PrivacyPolicy" },
            { id: 62, name: "ข้อตกลงการกินซูชิ", href: "/TermOfService" },
        ]
    },
];

// --- Helper Functions ---
function classNames(...classes) {
    return classes.filter(Boolean).join(' ');
}

// --- Custom Hook for Scroll Direction (Red Theme) ---
const useScrollDirection = (isMobileMenuOpen) => {
    const [scrollDirection, setScrollDirection] = useState('up');
    const [lastScrollY, setLastScrollY] = useState(0);
    const [atTop, setAtTop] = useState(true);
    const navbarHeight = 80;

    const controlNavbar = useCallback(() => {
        const currentScrollY = window.scrollY;
        
        if (isMobileMenuOpen) {
            setScrollDirection('up');
            return;
        }

        if (currentScrollY > lastScrollY && currentScrollY > navbarHeight) {
            setScrollDirection('down');
        } else {
            setScrollDirection('up');
        }
        
        setAtTop(currentScrollY < navbarHeight);
        setLastScrollY(currentScrollY <= 0 ? 0 : currentScrollY);

    }, [lastScrollY, isMobileMenuOpen]);

    useEffect(() => {
        window.addEventListener("scroll", controlNavbar, { passive: true });
        return () => window.removeEventListener("scroll", controlNavbar);
    }, [controlNavbar]);

    const navClasses = scrollDirection === 'up' ? "translate-y-0" : "-translate-y-full";
    const shadowClass = !atTop && scrollDirection === 'up' ? "shadow-lg shadow-black/20" : "";
    
    // ✨ MODIFIED: เปลี่ยน bg-gray-800 เป็น bg-[#991b1b] (สีแดงเข้ม)
    const backgroundClass = atTop ? "bg-[#991b1b]/95" : "bg-[#991b1b]/90 backdrop-blur-sm";

    return classNames("fixed top-0 left-0 right-0 w-full z-30 transition-all duration-300 ease-in-out", navClasses, shadowClass, backgroundClass);
};


// --- Reusable Sub-components (Red Theme) ---

const DesktopNavLink = ({ item, isCurrent }) => (
    <Link 
        to={item.href}
        // ✨ MODIFIED: เปลี่ยน text เป็นสีขาว
        className="group relative rounded-lg px-3 py-2 text-[14px] font-medium text-white transition-colors duration-200 hover:text-red-100"
        aria-current={isCurrent ? 'page' : undefined}
    >
        {item.name}
        <span 
            className={classNames(
                "absolute bottom-0 left-0 h-0.5 w-full bg-white transition-transform duration-300 ease-out",
                isCurrent ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
            )}
        />
    </Link>
);

const DesktopDropdown = ({ item, isCurrent, location }) => (
    <Menu as="div" className="relative">
        {/* ✨ MODIFIED: เปลี่ยน text เป็นสีขาว */}
        <Menu.Button className="group inline-flex items-center rounded-lg px-3 py-2 text-[14px] font-medium text-white transition-colors duration-200 hover:text-red-100 focus:outline-none">
            <span>{item.name}</span>
            <ChevronDownIcon className="ml-1.5 size-4 transition-transform duration-200 group-data-[open]:rotate-180" aria-hidden="true" />
            <span 
                className={classNames(
                    "absolute bottom-0 left-0 h-0.5 w-full bg-white transition-transform duration-300 ease-out",
                    isCurrent ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                )}
            />
        </Menu.Button>
        <Transition
            as={Fragment}
            enter="transition ease-out duration-200"
            enterFrom="transform opacity-0 scale-95 -translate-y-2"
            enterTo="transform opacity-100 scale-100 translate-y-0"
            leave="transition ease-in duration-150"
            leaveFrom="transform opacity-100 scale-100 translate-y-0"
            leaveTo="transform opacity-0 scale-95 -translate-y-2"
        >
            {/* ✨ MODIFIED: เปลี่ยนพื้นหลัง Dropdown เป็นสีแดงที่เข้มกว่า (#7f1d1d) เพื่อให้มีมิติ */}
            <Menu.Items className="absolute left-0 z-20 mt-2 w-56 origin-top-left rounded-xl bg-[#7f1d1d]/95 p-1.5 shadow-xl backdrop-blur-md ring-1 ring-white/10 focus:outline-none">
                {item.children.map((child) => (
                    <Menu.Item key={child.id}>
                        {({ active }) => (
                            <Link 
                                to={child.href}
                                // ✨ MODIFIED: ปรับสี active ให้เป็นสีขาวจางๆ
                                className={classNames(
                                    active ? 'bg-white/10 text-white' : 'text-white',
                                    location.pathname === child.href ? 'font-semibold' : '',
                                    'block rounded-lg px-3 py-2.5 text-[14px] transition-colors'
                                )}
                            >
                                {child.name}
                            </Link>
                        )}
                    </Menu.Item>
                ))}
            </Menu.Items>
        </Transition>
    </Menu>
);

const MobileNavLink = ({ item, isCurrent, close }) => (
    <Disclosure.Button
        as={Link}
        to={item.href}
        onClick={close}
        // ✨ MODIFIED: ปรับสี active เป็นสีขาวจางๆ
        className={classNames(
            isCurrent ? 'bg-white/10 text-white' : 'text-white hover:bg-white/10 hover:text-white',
            'block rounded-md px-3 py-2.5 text-base font-medium transition-colors'
        )}
        aria-current={isCurrent ? 'page' : undefined}
    >
        {item.name}
    </Disclosure.Button>
);

const MobileAccordion = ({ item, location, close }) => (
    <Disclosure as="div" className="space-y-1">
        {({ open }) => (
            <>
                {/* ✨ MODIFIED: ปรับสี text และ hover */}
                <Disclosure.Button className="w-full flex justify-between items-center rounded-md px-3 py-2.5 text-base font-medium text-white hover:bg-white/10 hover:text-white transition-colors">
                    <span>{item.name}</span>
                    <ChevronDownIcon className={classNames(open ? 'rotate-180' : '', 'h-5 w-5 transition-transform')} />
                </Disclosure.Button>
                <Transition
                    enter="transition-all ease-out duration-300"
                    enterFrom="opacity-0 max-h-0"
                    enterTo="opacity-100 max-h-96"
                    leave="transition-all ease-in duration-200"
                    leaveFrom="opacity-100 max-h-96"
                    leaveTo="opacity-0 max-h-0"
                >
                    <Disclosure.Panel className="pl-4 space-y-1 overflow-hidden">
                        {item.children.map(child => (
                            <MobileNavLink 
                                key={child.id} 
                                item={child} 
                                isCurrent={location.pathname === child.href} 
                                close={close}
                            />
                        ))}
                    </Disclosure.Panel>
                </Transition>
            </>
        )}
    </Disclosure>
);

const SocialIcons = () => (
    <div className="flex items-center space-x-4">
        {[
            { name: 'X (Twitter)', href: 'https://twitter.com', icon: FaXTwitter },
            { name: 'Facebook', href: 'https://www.facebook.com/Boruyasushi', icon: FaFacebook },
            { name: 'Instagram', href: 'https://www.instagram.com/boruyasushi/', icon: FaInstagram },
        ].map(social => (
            <a 
                key={social.name}
                href={social.href} 
                target="_blank" 
                rel="noopener noreferrer" 
                // ✨ MODIFIED: เปลี่ยน text เป็นสีขาว
                className="text-white transition-all duration-300 hover:text-red-200 hover:scale-110"
            >
                <span className="sr-only">{social.name}</span>
                <social.icon aria-hidden="true" className="size-5" />
            </a>
        ))}
    </div>
);


// --- Main Header Component (Red Theme) ---
export default function Header() {
    const location = useLocation();

    const isIdolPage = location.pathname === '/idol_Blackneko';
    if (isIdolPage) {
        return (
            <nav className="bg-slate-900 text-white p-4">
                <div className="mx-auto max-w-7xl"><p>นี่คือแถบนำทางสำหรับหน้า Idol Blackneko</p></div>
            </nav>
        );
    }

    return (
        <Disclosure as="nav">
            {({ open: mobileMenuIsOpen, close: closeMobileMenu }) => {
                const navClasses = useScrollDirection(mobileMenuIsOpen);

                return (
                    <div className={navClasses}>
                        <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
                            <div className="relative flex h-20 items-center justify-between">
                                <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                                    {/* ✨ MODIFIED: ปรับปุ่ม Hamburger เป็นสีขาว */}
                                    <Disclosure.Button className="group p-2 text-white hover:bg-white/10 rounded-md focus:outline-none focus:ring-2 focus:ring-white">
                                        <span className="sr-only">Open main menu</span>
                                        {mobileMenuIsOpen ? <XMarkIcon aria-hidden="true" className="block size-6" /> : <Bars3Icon aria-hidden="true" className="block size-6" />}
                                    </Disclosure.Button>
                                </div>

                                <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                                    <Link to="/" className="flex-shrink-0">
                                        {/* ✨ MODIFIED: Logo ปกติ (ไม่มี grayscale) */}
                                        <img alt="Boruya Sushi Logo" src={logoLightMode} className="h-12 md:h-16 w-auto transition-transform duration-300 hover:scale-105" />
                                    </Link>
                                </div>
                                
                                <div className="absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 sm:block">
                                    <div className="flex space-x-1 md:space-x-2">
                                        {navigation.map((item) => {
                                            const isCurrent = location.pathname === item.href || (item.children && item.children.some(child => location.pathname === child.href));
                                            return item.children ? (
                                                <DesktopDropdown key={item.id} item={item} isCurrent={isCurrent} location={location} />
                                            ) : (
                                                <DesktopNavLink key={item.id} item={item} isCurrent={isCurrent} />
                                            );
                                        })}
                                    </div>
                                </div>

                                <div className="absolute inset-y-0 right-0 hidden items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0 sm:flex">
                                   <SocialIcons />
                                </div>
                            </div>
                        </div>

                        {/* ✨ MODIFIED: ปรับพื้นหลัง Mobile Menu เป็นสีแดงเข้ม (#991b1b) */}
                        <Disclosure.Panel className="sm:hidden border-t border-white/10 bg-[#991b1b]">
                            <div className="space-y-2 px-2 pt-2 pb-4">
                                {navigation.map((item) => {
                                    const isCurrent = location.pathname === item.href;
                                    return item.children ? (
                                        <MobileAccordion key={item.id} item={item} location={location} close={closeMobileMenu} />
                                    ) : (
                                        <MobileNavLink key={item.id} item={item} isCurrent={isCurrent} close={closeMobileMenu} />
                                    );
                                })}
                                {/* ✨ MODIFIED: ปรับสีเส้นคั่น */}
                                <div className="pt-4 mt-4 border-t border-white/10 flex justify-center">
                                    <SocialIcons />
                                </div>
                            </div>
                        </Disclosure.Panel>
                    </div>
                );
            }}
        </Disclosure>
    );
}