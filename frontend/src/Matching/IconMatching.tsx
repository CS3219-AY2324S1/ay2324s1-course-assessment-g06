import React from 'react';

import arrayIcon from './icons/array.png';
import binarySearchIcon from './icons/binary_search.png';
import hashTableIcon from './icons/hash_table.png';
import linkedListIcon from './icons/linked_list.png';
import mathIcon from './icons/math.png';
import matrixIcon from './icons/matrix.png';
import stackIcon from './icons/stack.png';
import stringIcon from './icons/string.png';
import treeIcon from './icons/tree.png';

import arrayActiveIcon from './icons/active/array_active.png';
import binarySearchActiveIcon from './icons/active/binary_search_active.png';
import hashTableActiveIcon from './icons/active/hash_table_active.png';
import linkedListActiveIcon from './icons/active/linked_list_active.png';
import mathActivecon from './icons/active/math_active.png';
import matrixActiveIcon from './icons/active/matrix_active.png';
import stackActiveIcon from './icons/active/stack_active.png';
import stringActiveIcon from './icons/active/string_active.png';
import treeActiveIcon from './icons/active/tree_active.png';

export const iconCategories = [
  { label: 'Array', iconFilePath: arrayIcon, activeIconFilePath: arrayActiveIcon },
  { label: 'Binary Search', iconFilePath: binarySearchIcon, activeIconFilePath: binarySearchActiveIcon },
  { label: 'Hash Table', iconFilePath: hashTableIcon, activeIconFilePath: hashTableActiveIcon },
  { label: 'Linked List', iconFilePath: linkedListIcon, activeIconFilePath: linkedListActiveIcon },
  { label: 'Math', iconFilePath: mathIcon, activeIconFilePath: mathActivecon },
  { label: 'Matrix', iconFilePath: matrixIcon, activeIconFilePath: matrixActiveIcon },
  { label: 'Stack', iconFilePath: stackIcon, activeIconFilePath: stackActiveIcon },
  { label: 'String', iconFilePath: stringIcon, activeIconFilePath: stringActiveIcon },
  { label: 'Tree', iconFilePath: treeIcon, activeIconFilePath: treeActiveIcon },
];
