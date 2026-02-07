import React from 'react';

// Key ของ Object ต้องตรงกับชื่อไฟล์รูป (ไม่รวม _order_button.png)
const INGREDIENT_ASSETS = {
  shrimp: 'shrimp',
  rice: 'rice',
  nori: 'nori',
  roe: 'roe',
  salmon: 'salmon',
  unagi: 'unagi',
};

const KitchenArea = ({ ingredients, onIngredientClick, onMakeSushi, onClearPlate, currentPlate }) => {
  return (
    <div className="kitchen-area">
      <div className="ingredient-bins">
        {Object.keys(INGREDIENT_ASSETS).map((ingKey) => (
          <div key={ingKey} className="ingredient-bin" onClick={() => onIngredientClick(ingKey)}>
            <img src={`/images/${INGREDIENT_ASSETS[ingKey]}_order_button.png`} alt={ingKey} />
            <span className="ingredient-quantity">{ingredients[ingKey]}</span>
          </div>
        ))}
      </div>

      <div className="preparation-area">
        <div className="sushi-mat">
          {/* แสดงวัตถุดิบที่อยู่บนเขียง */}
          {currentPlate.map((item, index) => (
            <div key={index} className="mat-ingredient">
              {item.slice(0, 3)}...
            </div>
          ))}
        </div>
        <div className="knife-area" onClick={onMakeSushi}>
            <p>ทำซูชิ</p>
        </div>
         <div className="clear-mat-button" onClick={onClearPlate}>
            <img src="/images/clear_mat.png" alt="Clear Mat"/>
        </div>
      </div>
    </div>
  );
};

export default KitchenArea;