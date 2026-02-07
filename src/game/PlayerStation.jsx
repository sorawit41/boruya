import React from 'react';

// --- นำเข้ารูปภาพทั้งหมด ---
// Ingredients
import riceImage from './images/ingredients/rice.png';
import noriImage from './images/ingredients/nori.png';
import tunaImage from './images/ingredients/tuna.png';
import salmonImage from './images/ingredients/salmon.png';
import shrimpImage from './images/ingredients/shrimp.png';
import eggImage from './images/ingredients/egg.png';


// Sushi
import tunaNigiriImage from './images/sushi/tuna_nigiri.png';
import salmonNigiriImage from './images/sushi/salmon_nigiri.png';
import ebiNigiriImage from './images/sushi/ebi_nigiri.png';
import tunaRollImage from './images/sushi/tuna_roll.png';
import tamagoNigiriImage from './images/sushi/tamago_nigiri.png';


// --- สูตรซูชิ ---
export const SUSHI_RECIPES = {
  'salmon_nigiri': { displayName: 'แซลมอน', image: salmonNigiriImage, ingredients: ['rice', 'salmon'] },
  'maguro_nigiri': { displayName: 'มากุโระ', image: tunaNigiriImage, ingredients: ['rice', 'tuna'] },
  'tamago_nigiri': { displayName: 'ทามาโงะ', image: tamagoNigiriImage, ingredients: ['rice', 'egg'] },
  'ebi_nigiri': { displayName: 'เอบิ (กุ้ง)', image: ebiNigiriImage, ingredients: ['rice', 'shrimp'] },
  'unagi_nigiri': { displayName: 'อุนางิ (ปลาไหล)', image: unagiNigiriImage, ingredients: ['rice', 'unagi'] },
  'ikura_gunkan': { displayName: 'อิคุระ', image: ikuraGunkanImage, ingredients: ['rice', 'nori', 'ikura'] },
  'tekka_maki': { displayName: 'ท็กกะมากิ', image: tunaRollImage, ingredients: ['rice', 'nori', 'tuna'] },
  'kappa_maki': { displayName: 'คัปปะมากิ', image: kappaMakiImage, ingredients: ['rice', 'nori', 'cucumber'] },
};

// --- วัตถุดิบ ---
export const INGREDIENTS = [
  { type: 'rice', displayName: 'ข้าว', image: riceImage },
  { type: 'nori', displayName: 'สาหร่าย', image: noriImage },
  { type: 'salmon', displayName: 'แซลมอน', image: salmonImage },
  { type: 'tuna', displayName: 'ทูน่า', image: tunaImage },
  { type: 'egg', displayName: 'ไข่หวาน', image: eggImage },
  { type: 'ikura', displayName: 'อิคุระ', image: ikuraImage },
  { type: 'shrimp', displayName: 'กุ้ง', image: shrimpImage },
  { type: 'unagi', displayName: 'ปลาไหล', image: unagiImage },
  { type: 'cucumber', displayName: 'แตงกวา', image: cucumberImage },
];

function PlayerStation({
  onSelectIngredient,
  onClear,
  onCraft,
  onServe,
  currentIngredients,
  craftedSushi,
  gameActive
}) {
  return (
    <div className="w-full max-w-3xl bg-white shadow-2xl rounded-2xl p-6 flex flex-col gap-6 border mx-auto">

      {/* --- ส่วนที่ 1: เลือกวัตถุดิบ --- */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800">สถานีทำซูชิ</h2>
        <p className="text-gray-500">เลือกวัตถุดิบเพื่อวางบนเขียง</p>
        <div className="flex flex-wrap justify-center gap-4 mt-4 bg-gray-50 p-4 rounded-lg border">
          {INGREDIENTS.map(ingredient => (
            <button
              key={ingredient.type}
              onClick={() => onSelectIngredient(ingredient.type)}
              disabled={!gameActive || currentIngredients.length >= 3}
              className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-3 rounded-lg disabled:bg-gray-400 disabled:cursor-not-allowed transition-transform transform hover:scale-105 flex flex-col items-center gap-2 w-20"
            >
              <img src={ingredient.image} alt={ingredient.displayName} className="w-8 h-8 object-contain" />
              <span className="text-xs">{ingredient.displayName}</span>
            </button>
          ))}
        </div>
      </div>

      {/* --- ส่วนที่ 2: พื้นที่ทำงาน (เขียง และ จานเสิร์ฟ) --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-100 p-4 rounded-xl border shadow-inner">
          <h3 className="text-lg font-semibold text-center text-gray-600">บนเขียง</h3>
          <div className="w-full min-h-[100px] bg-white rounded-lg mt-2 flex justify-center items-center space-x-4 p-4 border-2">
            {currentIngredients.length > 0
              ? currentIngredients.map((ing, index) => (
                  <img
                    key={index}
                    src={INGREDIENTS.find(i => i.type === ing)?.image}
                    alt={ing}
                    className="w-14 h-14 object-contain animate-fade-in"
                  />
                ))
              : <span className="text-sm text-gray-500">ว่าง</span>
            }
          </div>
        </div>

        <div className="bg-gray-100 p-4 rounded-xl border shadow-inner">
          <h3 className="text-lg font-semibold text-center text-gray-600">จานสำหรับเสิร์ฟ</h3>
          <div className="w-full min-h-[100px] bg-white rounded-lg mt-2 flex justify-center items-center p-4 border-2 border-blue-400">
            {craftedSushi
              ? <img
                  src={SUSHI_RECIPES[craftedSushi]?.image}
                  alt={SUSHI_RECIPES[craftedSushi]?.displayName}
                  className="w-24 h-24 object-contain animate-fade-in scale-110"
                />
              : <span className="text-sm text-gray-500">ว่าง</span>
            }
          </div>
        </div>
      </div>

      {/* --- ส่วนที่ 3: ปุ่มควบคุม --- */}
      <div className="flex justify-center gap-4 border-t pt-6">
        <button
          onClick={onClear}
          disabled={!gameActive || currentIngredients.length === 0}
          className="bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-6 rounded-lg disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          ล้างเขียง
        </button>
        <button
          onClick={onCraft}
          disabled={!gameActive || currentIngredients.length === 0}
          className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-3 px-6 rounded-lg disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          สร้าง
        </button>
        <button
          onClick={onServe}
          disabled={!gameActive || !craftedSushi}
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          เสิร์ฟ
        </button>
      </div>

    </div>
  );
}

export default PlayerStation;