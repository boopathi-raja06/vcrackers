import React, { createContext, useContext, useState, useEffect } from 'react';
import { getColorSettings } from '../firebase/firestoreService';

// Create Color Context
const ColorContext = createContext();

// Color Provider Component
export const ColorProvider = ({ children }) => {
  const [colors, setColors] = useState({
    menuBgColor: '#ffffff',
    menuTextColor: '#374151',
    newsBgColor: '#f3f4f6',
    newsTextColor: '#111827',
    tableHeadBgColor: '#f9fafb',
    tableHeadTextColor: '#374151',
    tableBodyBgColor: '#ffffff',
    tableBodyTextColor: '#6b7280',
    itemGroupBgColor: '#f8fafc',
    itemGroupTextColor: '#475569',
    totalBgColor: '#3b82f6',
    totalTextColor: '#ffffff'
  });
  
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = getColorSettings((colorData) => {
      setColors(prevColors => ({
        ...prevColors,
        ...colorData
      }));
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Helper function to get color styles for components
  const getColorStyles = () => ({
    // Menu/Navigation styles
    menu: {
      backgroundColor: colors.menuBgColor,
      color: colors.menuTextColor
    },
    
    // News/Announcement styles  
    news: {
      backgroundColor: colors.newsBgColor,
      color: colors.newsTextColor
    },
    
    // Table styles
    tableHead: {
      backgroundColor: colors.tableHeadBgColor,
      color: colors.tableHeadTextColor
    },
    
    tableBody: {
      backgroundColor: colors.tableBodyBgColor,
      color: colors.tableBodyTextColor
    },
    
    // Item Group/Category styles
    itemGroup: {
      backgroundColor: colors.itemGroupBgColor,
      color: colors.itemGroupTextColor
    },
    
    // Total/Summary styles
    total: {
      backgroundColor: colors.totalBgColor,
      color: colors.totalTextColor
    }
  });

  // Helper function to get individual colors
  const getColor = (colorKey) => {
    return colors[colorKey] || '#000000';
  };

  // Helper function to check if a color is light (for contrast decisions)
  const isLightColor = (hex) => {
    if (!hex || hex === '#000000') return false;
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness > 155;
  };

  // Generate CSS custom properties for dynamic styling
  const generateCSSVariables = () => {
    return {
      '--menu-bg-color': colors.menuBgColor,
      '--menu-text-color': colors.menuTextColor,
      '--news-bg-color': colors.newsBgColor,
      '--news-text-color': colors.newsTextColor,
      '--table-head-bg-color': colors.tableHeadBgColor,
      '--table-head-text-color': colors.tableHeadTextColor,
      '--table-body-bg-color': colors.tableBodyBgColor,
      '--table-body-text-color': colors.tableBodyTextColor,
      '--item-group-bg-color': colors.itemGroupBgColor,
      '--item-group-text-color': colors.itemGroupTextColor,
      '--total-bg-color': colors.totalBgColor,
      '--total-text-color': colors.totalTextColor
    };
  };

  const value = {
    colors,
    loading,
    getColorStyles,
    getColor,
    isLightColor,
    generateCSSVariables
  };

  return (
    <ColorContext.Provider value={value}>
      <div style={generateCSSVariables()}>
        {children}
      </div>
    </ColorContext.Provider>
  );
};

// Custom hook to use color context
export const useColors = () => {
  const context = useContext(ColorContext);
  if (!context) {
    throw new Error('useColors must be used within a ColorProvider');
  }
  return context;
};

// Higher Order Component for color integration
export const withColors = (Component) => {
  return function WrappedComponent(props) {
    const colorContext = useColors();
    return <Component {...props} colors={colorContext} />;
  };
};

export default ColorContext;
