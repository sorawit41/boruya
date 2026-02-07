import React from 'react';
import { Media, Message, NewsAndEvent, SideNav, Map } from '../components';
import HeroBanner from '../components/HeroBanner';
import { Notifications } from '../components';

const Home = () => {
  return (
    <div className="flex flex-col lg:flex-row py-20" >
    
    <div className="min-h-screen bg-white relative">
      
       {/* SideNav <SideNav />.    จะยึดตำแหน่งของมันเอง */}

      {/* 2. สร้าง Section พร้อม ID: ให้แต่ละส่วนมี id ตรงกับที่ SideNav กำหนด */}
      
    <SideNav />
    <Notifications />
      <section id="hero" className="w-full">
        <HeroBanner />
      </section>
      <section id="NewsAndEvent" className="w-full">
        <NewsAndEvent />
      </section>
      <section id="message" className="w-full">
        {/*<Message />*/}
      </section>
      <section id="Media" className="w-full">
        <Media />
      </section>
      <section id="Map" className="w-full">
        <Map />
      </section>
    </div>
    </div>
  );
};

export default Home;