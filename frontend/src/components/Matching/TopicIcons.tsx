import React from 'react';

// To dynamically import icons
function importAll(r: any) {
  return r.keys().map(r);
}

const iconContext = require.context('../../images/topics', false, /\.png$/);
const activeIconContext = require.context('../../images/topics/active', false, /\.png$/);

const icons: any[] = importAll(iconContext);
const activeIcons: any[] = importAll(activeIconContext);

export const iconCategories = icons.map((icon: any, index: number) => ({
  label: iconContext.keys()[index]
    .replace(/_/g, ' ')
    .replace(/\.\//g, '')
    .replace('.png', '')
    .replace(/\b\w/g, (char) => char.toUpperCase()) // Capitalize the start of each word
    .replace(/- /g, '-') // Remove spaces after hyphens
  ,
  iconFilePath: icon,
  activeIconFilePath: activeIcons[index],
}));
