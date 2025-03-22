import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { menuService } from '../../services/supabase';
import { MenuCategory, MenuItem } from '../../features/menu/menuSlice';

const MenuPage: React.FC = () => {
  const { restaurantId } = useParams<{ restaurantId: string }>();
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!restaurantId) return;
      
      try {
        setLoading(true);
        const { data: categoriesData, error: categoriesError } = await menuService.getCategories(restaurantId);
        
        if (categoriesError) throw categoriesError;
        
        setCategories(categoriesData || []);
        
        if (categoriesData && categoriesData.length > 0) {
          setSelectedCategory(categoriesData[0].id);
          const { data: itemsData, error: itemsError } = await menuService.getAllMenuItems(restaurantId);
          
          if (itemsError) throw itemsError;
          
          setItems(itemsData || []);
        }
      } catch (err: any) {
        setError(err.message || 'Failed to load menu');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [restaurantId]);

  const filteredItems = selectedCategory 
    ? items.filter(item => item.categoryId === selectedCategory) 
    : items;

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="bg-red-50 border-l-4 border-red-400 p-4 max-w-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Menu</h1>
      
      {/* Category tabs */}
      <div className="mb-6 border-b border-gray-200">
        <nav className="-mb-px flex space-x-8 overflow-x-auto">
          {categories.map(category => (
            <button
              key={category.id}
              className={`
                whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm
                ${selectedCategory === category.id 
                  ? 'border-primary-500 text-primary-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
              `}
              onClick={() => setSelectedCategory(category.id)}
            >
              {category.name}
            </button>
          ))}
        </nav>
      </div>
      
      {/* Menu items grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map(item => (
          <div key={item.id} className="card">
            {item.imageUrl && (
              <div className="h-48 w-full overflow-hidden">
                <img 
                  src={item.imageUrl} 
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <div className="p-4">
              <div className="flex justify-between items-start">
                <h3 className="text-lg font-semibold">{item.name}</h3>
                <span className="text-lg font-medium">${item.price.toFixed(2)}</span>
              </div>
              <p className="text-gray-600 mt-1 text-sm">{item.description}</p>
              
              <button 
                className="mt-4 btn-primary w-full"
                disabled={!item.available}
              >
                {item.available ? 'Add to Order' : 'Unavailable'}
              </button>
            </div>
          </div>
        ))}
      </div>
      
      {filteredItems.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No items available in this category</p>
        </div>
      )}
    </div>
  );
};

export default MenuPage; 