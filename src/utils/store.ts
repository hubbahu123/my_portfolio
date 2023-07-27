import { create } from 'zustand';

// Store Files and Windows
interface Store {}

export const useStore = create<Store>(set => ({}));
