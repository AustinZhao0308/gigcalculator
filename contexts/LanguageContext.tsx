import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'en' | 'zh';

export const translations = {
  en: {
    // Navigation
    navDashboard: 'Financial Overview',
    navVenue: 'Venue & Tickets',
    navBands: 'Lineup & Travel',
    navSchedule: 'Schedule & Misc',
    subtitle: 'Event Budgeting Tool',
    currentEvent: 'Current Event',
    autoSaving: 'Auto-Saving',
    export: 'Export',
    import: 'Import',
    exportTooltip: 'Export event data to JSON file',
    importTooltip: 'Import event data from JSON file',
    importSuccess: 'Event data imported successfully!',
    importError: 'Error importing file. Please check the file format.',
    
    // Dashboard
    totalRevenue: 'Total Projected Revenue',
    totalCosts: 'Total Projected Costs',
    netProfit: 'Net Profit',
    capacityWarnings: 'Capacity Warnings',
    warningMsg: (day: number, alloc: number, cap: number) => `Day ${day}: Allocated tickets (${alloc}) exceed venue capacity (${cap}).`,
    costBreakdown: 'Cost Breakdown',
    costSubtitle: 'Where is the money going?',
    revenueVsCost: 'Revenue vs Cost',
    financialHealth: 'Projected Financial Health',
    
    // Band Manager
    lineupCosts: 'Lineup & Costs',
    addBand: 'Add Band',
    bandDetails: 'Band Details',
    bandName: 'Band Name',
    members: 'Members',
    location: 'Location',
    description: 'Description',
    financials: 'Financials',
    showFee: 'Performance Fee (Show Fee)',
    travelExpenses: 'Travel & Expenses Breakdown',
    addExpense: 'Add Expense',
    noTravel: 'No travel expenses added yet.',
    totalTravel: 'Total Travel',
    noBands: 'No bands added yet. Start by adding a band to your lineup.',
    descPlaceholder: 'e.g. The Rockers',
    
    // Venue & Tickets
    venueSetup: 'Venue & Event Setup',
    eventDuration: 'Event Duration (Days)',
    venueName: 'Venue Name',
    capacity: 'Capacity (Pax)',
    baseFee: 'Base Fee (Guarantee)',
    enableRevShare: 'Enable Revenue Split',
    revShareHelp: 'If the calculated share exceeds the Base Fee, the venue takes the share instead.',
    venueSplit: 'Venue Split % (on Ticket Sales)',
    barRevenue: 'Expected Bar Revenue Split (to Organizer)',
    ticketingStrategy: 'Ticketing Strategy',
    addTicket: 'Add Ticket Type',
    ticketName: 'Ticket Name (e.g. Student)',
    price: 'Price',
    totalSupply: 'Total Supply',
    expectedSales: 'Expected Sales',
    validDays: 'Valid for Days',
    multiDayActive: 'Multi-day Pass Active',
    noTickets: 'No tickets defined.',
    day: 'Day',

    // Expenses & Schedule
    productionMarketing: 'Production & Marketing',
    addItem: 'Add Item',
    expenseName: 'Expense Name',
    cost: 'Cost',
    totalMisc: 'Total Misc Costs',
    merchandise: 'Merchandise',
    addProduct: 'Add Product',
    unitCost: 'Unit Cost',
    sellPrice: 'Sell Price',
    qtyMade: 'Qty Made',
    potentialProfit: 'Potential Profit',
    runOfShow: 'Run of Show',
    scheduleFor: (day: number) => `Day ${day} Schedule`,
    addPerformance: 'Add Performance',
    selectBand: 'Select Band...',
    add: 'Add'
  },
  zh: {
    // Navigation
    navDashboard: '财务概览',
    navVenue: '场地与票务',
    navBands: '阵容与差旅',
    navSchedule: '日程与杂项',
    subtitle: '演出预算工具',
    currentEvent: '当前活动',
    autoSaving: '自动保存中',
    export: '导出',
    import: '导入',
    exportTooltip: '导出活动数据为 JSON 文件',
    importTooltip: '从 JSON 文件导入活动数据',
    importSuccess: '活动数据导入成功！',
    importError: '导入文件出错，请检查文件格式。',

    // Dashboard
    totalRevenue: '总预期收入',
    totalCosts: '总预期成本',
    netProfit: '净利润',
    capacityWarnings: '容量警告',
    warningMsg: (day: number, alloc: number, cap: number) => `第 ${day} 天：已分配票数 (${alloc}) 超过场地容量 (${cap})。`,
    costBreakdown: '成本明细',
    costSubtitle: '资金去向分析',
    revenueVsCost: '收支对比',
    financialHealth: '预期财务健康状况',

    // Band Manager
    lineupCosts: '阵容与成本',
    addBand: '添加乐队',
    bandDetails: '乐队详情',
    bandName: '乐队名称',
    members: '成员人数',
    location: '所在地',
    description: '简介',
    financials: '财务信息',
    showFee: '演出费 (Show Fee)',
    travelExpenses: '差旅费用明细',
    addExpense: '添加费用',
    noTravel: '暂无差旅费用。',
    totalTravel: '差旅总计',
    noBands: '暂无乐队。请先添加乐队。',
    descPlaceholder: '例如：痛仰乐队',

    // Venue & Tickets
    venueSetup: '场地与活动设置',
    eventDuration: '活动天数',
    venueName: '场地名称',
    capacity: '场地容量 (人)',
    baseFee: '场地保底费用',
    enableRevShare: '启用票房分成',
    revShareHelp: '如果计算出的分成金额超过保底费，场地将按分成金额收取。',
    venueSplit: '场地分成比例 % (门票收入)',
    barRevenue: '预期酒水分成 (给主办方)',
    ticketingStrategy: '票务策略',
    addTicket: '添加票种',
    ticketName: '票种名称 (如：学生票)',
    price: '价格',
    totalSupply: '发行总量',
    expectedSales: '预期销量',
    validDays: '有效日期',
    multiDayActive: '多日通票已激活',
    noTickets: '未定义票种。',
    day: '第', // Used as "Day X" or "第 X 天" logic requires care, handled simply here

    // Expenses & Schedule
    productionMarketing: '宣发与制作',
    addItem: '添加项目',
    expenseName: '支出项名称',
    cost: '金额',
    totalMisc: '杂项总计',
    merchandise: '周边商品',
    addProduct: '添加商品',
    unitCost: '单件成本',
    sellPrice: '售价',
    qtyMade: '制作数量',
    potentialProfit: '潜在利润',
    runOfShow: '演出流程',
    scheduleFor: (day: number) => `第 ${day} 天日程`,
    addPerformance: '添加演出时段',
    selectBand: '选择乐队...',
    add: '添加'
  }
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: typeof translations['en'];
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: React.PropsWithChildren<{}>) => {
  const [language, setLanguage] = useState<Language>('en');

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t: translations[language] }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};