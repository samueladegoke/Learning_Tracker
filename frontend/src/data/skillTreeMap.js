export const SKILL_TREE_MAP = [
  {
    id: '1',
    label: 'Python Basics',
    category: 'language',
    status: 'completed',
    position: { x: 400, y: 50 },
    prerequisites: [],
    days: ['day-1', 'day-2', 'day-12', 'day-13', 'day-14', 'day-15']
  },
  {
    id: '2',
    label: 'Control Flow',
    category: 'logic',
    status: 'completed',
    position: { x: 250, y: 200 },
    prerequisites: ['1'],
    days: ['day-3', 'day-4', 'day-5', 'day-7']
  },
  {
    id: '3',
    label: 'Functions',
    category: 'logic',
    status: 'available',
    position: { x: 550, y: 200 },
    prerequisites: ['1'],
    days: ['day-6', 'day-8', 'day-9', 'day-10', 'day-11']
  },
  {
    id: '4',
    label: 'Data Structures',
    category: 'computer-science',
    status: 'locked',
    position: { x: 400, y: 350 },
    prerequisites: ['2', '3'],
    days: ['day-4', 'day-9', 'day-25', 'day-26']
  },
  {
    id: '5',
    label: 'OOP',
    category: 'paradigm',
    status: 'locked',
    position: { x: 250, y: 500 },
    prerequisites: ['4'],
    days: ['day-16', 'day-17', 'day-18', 'day-19', 'day-20', 'day-21', 'day-22', 'day-23']
  },
  {
    id: '6',
    label: 'Algorithms',
    category: 'computer-science',
    status: 'locked',
    position: { x: 550, y: 500 },
    prerequisites: ['4'],
    days: ['day-11', 'day-14', 'day-51', 'day-52']
  },
  {
    id: '7',
    label: 'Web Scraping',
    category: 'application',
    status: 'locked',
    position: { x: 100, y: 650 },
    prerequisites: ['5'],
    days: ['day-45', 'day-46', 'day-47', 'day-48', 'day-49', 'day-50', 'day-51', 'day-52', 'day-53']
  },
  {
    id: '8',
    label: 'API Development',
    category: 'application',
    status: 'locked',
    position: { x: 400, y: 650 },
    prerequisites: ['5'],
    days: ['day-33', 'day-34', 'day-35', 'day-36', 'day-37', 'day-38', 'day-39', 'day-40']
  },
  {
    id: '9',
    label: 'Data Analysis',
    category: 'data-science',
    status: 'locked',
    position: { x: 700, y: 650 },
    prerequisites: ['6'],
    days: ['day-72', 'day-73', 'day-74', 'day-75', 'day-76', 'day-77', 'day-78', 'day-79', 'day-80', 'day-81']
  }
];
