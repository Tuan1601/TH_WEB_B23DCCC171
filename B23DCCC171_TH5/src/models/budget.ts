import { Reducer } from 'redux';
import { BudgetCategory } from '@/types';
import { notification } from 'antd';

export interface BudgetModelState {
  totalBudget: number;
  categories: BudgetCategory[];
}

export interface BudgetModelType {
  namespace: 'budget';
  state: BudgetModelState;
  reducers: {
    setTotalBudget: Reducer<BudgetModelState>;
    updateCategory: Reducer<BudgetModelState>;
    addExpense: Reducer<BudgetModelState>;
  };
}

const initialCategories: BudgetCategory[] = [
    { id: 'accom', name: 'accommodation', allocated: 0, spent: 0 },
    { id: 'food', name: 'food', allocated: 0, spent: 0 },
    { id: 'trans', name: 'transport', allocated: 0, spent: 0 },
    { id: 'activ', name: 'activities', allocated: 0, spent: 0 },
    { id: 'other', name: 'other', allocated: 0, spent: 0 },
];

const BudgetModel: BudgetModelType = {
  namespace: 'budget',

  state: {
    totalBudget: 1000000, 
    categories: initialCategories,
  },


  reducers: {
    setTotalBudget(state, { payload }) {
      return { ...state, totalBudget: payload };
    },
    updateCategory(state, { payload }) {
      const categories = state.categories.map(cat => {
        if (cat.id === payload.id) {
          return { ...cat, ...payload.values };
        }
        return cat;
      });
      return { ...state, categories };
    },
    addExpense(state, { payload }) {
       let newSpentTotal = 0;
       const categories = state.categories.map(cat => {
           let newCat = cat;
           if (cat.id === payload.categoryId) {
               newCat = { ...cat, spent: cat.spent + payload.amount };
           }
           newSpentTotal += newCat.spent;
           return newCat;
       });

       const totalAllocated = categories.reduce((sum, cat) => sum + cat.allocated, 0);
       const overallSpent = categories.reduce((sum, cat) => sum + cat.spent, 0);

       if (overallSpent > state.totalBudget) {
           notification.warning({
               message: 'Budget Alert',
               description: `You have exceeded your total budget of ${state.totalBudget}! Current spending: ${overallSpent}.`,
           });
       } else {
           const changedCategory = categories.find(c => c.id === payload.categoryId);
           if (changedCategory && changedCategory.allocated > 0 && changedCategory.spent > changedCategory.allocated) {
                notification.warning({
                   message: 'Category Budget Alert',
                   description: `You have exceeded your budget for ${changedCategory.name}! Allocated: ${changedCategory.allocated}, Spent: ${changedCategory.spent}.`,
               });
           }
       }

       return { ...state, categories };
    },
  },
};

export default BudgetModel;