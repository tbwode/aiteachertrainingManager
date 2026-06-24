// mock-data.js - 培训管理业务假数据

const MOCK_COURSE_TYPES = [
  {
    id: 'ct1',
    name: '师德师风',
    children: [
      { id: 'ct1-1', name: '职业道德', children: [] },
      { id: 'ct1-2', name: '师风建设', children: [] }
    ]
  },
  {
    id: 'ct2',
    name: '教学能力',
    children: [
      { id: 'ct2-1', name: '教学设计', children: [] },
      { id: 'ct2-2', name: '课堂管理', children: [] },
      { id: 'ct2-3', name: '教学评价', children: [] }
    ]
  },
  {
    id: 'ct3',
    name: '信息技术',
    children: [
      { id: 'ct3-1', name: '智慧课堂', children: [] },
      { id: 'ct3-2', name: 'AI应用', children: [] }
    ]
  },
  {
    id: 'ct4',
    name: '心理健康',
    children: []
  }
];

const MOCK_ORGANIZATION = [
  {
    id: 'o1',
    name: '教务处',
    children: [
      { id: 'o1-1', name: '教学研究组', children: [] },
      { id: 'o1-2', name: '课程开发组', children: [] }
    ]
  },
  {
    id: 'o2',
    name: '教师发展中心',
    children: [
      { id: 'o2-1', name: '新教师培训部', children: [] },
      { id: 'o2-2', name: '骨干教师培训部', children: [] }
    ]
  },
  {
    id: 'o3',
    name: '信息中心',
    children: []
  }
];

const MOCK_COURSES = [
  {
    id: 'c1',
    name: '新时代教师职业道德规范',
    type: ['ct1', 'ct1-1'],
    typeName: '师德师风 / 职业道德',
    status: 'published',
    instructor: '王晓明 / 教育部教师发展中心',
    sections: 8,
    rating: 4.8,
    learners: 342,
    updateTime: '2025-05-20 14:30:00',
    cover: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&h=225&fit=crop',
    description: '<p>本课程系统阐述了新时代教师职业道德规范的核心要义...</p>',
    departments: ['o1', 'o1-1'],
    creator: '李明',
    creatorPhone: '13800138001',
    rootTypeName: '师德师风',
    hours: 3.0,
    abilities: ['ability-curriculum', 'ability-research']
  },
  {
    id: 'c2',
    name: '智慧课堂教学设计与实践',
    type: ['ct3', 'ct3-1'],
    typeName: '信息技术 / 智慧课堂',
    status: 'published',
    rootTypeName: '信息技术',
    instructor: '张晓燕 / 智慧教育研究院',
    sections: 12,
    rating: 4.6,
    learners: 256,
    updateTime: '2025-05-18 09:15:00',
    cover: 'https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=400&h=225&fit=crop',
    description: '<p>深入讲解智慧课堂的设计理念与实施策略...</p>',
    departments: ['o2', 'o2-1'],
    creator: '张华',
    creatorPhone: '13900139001',
    hours: 4.0,
    abilities: ['ability-it', 'ability-interaction']
  },
  {
    id: 'c3',
    name: 'AI赋能教学创新',
    type: ['ct3', 'ct3-2'],
    typeName: '信息技术 / AI应用',
    status: 'draft',
    instructor: '陈技术 / AI教育实验室',
    sections: 6,
    rating: 0,
    learners: 0,
    updateTime: '2025-05-15 16:45:00',
    cover: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400&h=225&fit=crop',
    description: '<p>探索人工智能在教学中的创新应用场景...</p>',
    departments: ['o3'],
    creator: '王强',
    creatorPhone: '13700137001',
    rootTypeName: '信息技术',
    hours: 3.0,
    abilities: ['ability-it', 'ability-homework']
  },
  {
    id: 'c4',
    name: '学生心理健康辅导技巧',
    type: ['ct4'],
    typeName: '心理健康',
    status: 'published',
    rootTypeName: '心理健康',
    instructor: '刘心理 / 心理咨询中心',
    sections: 10,
    rating: 4.9,
    learners: 189,
    updateTime: '2025-05-10 11:20:00',
    cover: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400&h=225&fit=crop',
    description: '<p>掌握学生心理健康辅导的核心技巧...</p>',
    departments: ['o2', 'o2-2'],
    creator: '赵敏',
    creatorPhone: '13600136001',
    rootTypeName: '心理健康',
    hours: 2.0,
    abilities: ['ability-management', 'ability-interaction']
  },
  {
    id: 'c5',
    name: '高效课堂教学管理策略',
    type: ['ct2', 'ct2-2'],
    typeName: '教学能力 / 课堂管理',
    status: 'off',
    rootTypeName: '教学能力',
    instructor: '孙管理 / 教学管理研究所',
    sections: 5,
    rating: 0,
    learners: 0,
    updateTime: '2025-05-08 13:10:00',
    cover: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=400&h=225&fit=crop',
    description: '<p>学习高效课堂管理的实用策略...</p>',
    departments: ['o1'],
    creator: '周杰',
    creatorPhone: '13500135001',
    hours: 3.0,
    abilities: ['ability-management', 'ability-interaction']
  }
];

const MOCK_COURSE_CATALOG = {
  c1: {
    chapters: [
      {
        id: 'ch1',
        name: '第一章 职业道德概述',
        sort: 1,
        children: [
          { id: 'cw1', name: '1.1 职业道德的定义与内涵', type: 'text', resources: [], materials: 2, allowDownload: true },
          { id: 'cw2', name: '1.2 教师职业道德的历史演变', type: 'video', resources: [], materials: 1, allowDownload: false }
        ]
      },
      {
        id: 'ch2',
        name: '第二章 职业道德规范',
        sort: 2,
        children: [
          { id: 'cw3', name: '2.1 爱国守法', type: 'text', resources: [], materials: 0, allowDownload: true },
          { id: 'cw4', name: '2.2 爱岗敬业', type: 'document', docType: 'word', resources: [], materials: 3, allowDownload: true }
        ]
      }
    ]
  },
  c2: {
    chapters: [
      {
        id: 'ch3',
        name: '第一章 智慧课堂基础',
        sort: 1,
        children: [
          { id: 'cw5', name: '1.1 什么是智慧课堂', type: 'video', resources: [], materials: 1, allowDownload: true },
          { id: 'cw6', name: '1.2 智慧课堂核心技术', type: 'text', resources: [], materials: 2, allowDownload: true },
          { id: 'cw7', name: '1.3 智慧课堂实践案例', type: 'document', docType: 'ppt', resources: [], materials: 2, allowDownload: true }
        ]
      }
    ]
  }
};

const MOCK_COURSE_STATS = {
  c1: {
    totalSections: 8,
    totalMaterials: 12,
    totalLearners: 342,
    completedLearners: 298,
    completionRate: 87.1
  },
  c2: {
    totalSections: 12,
    totalMaterials: 18,
    totalLearners: 256,
    completedLearners: 210,
    completionRate: 82.0
  }
};

const MOCK_SECTION_STATS = {
  c1: [
    { chapterName: '第一章 职业道德概述', sectionName: '1.1 职业道德的定义与内涵', type: '图文', materials: 2, learners: 340, rate: 99.4 },
    { chapterName: '第一章 职业道德概述', sectionName: '1.2 教师职业道德的历史演变', type: '视频', materials: 1, learners: 335, rate: 98.0 },
    { chapterName: '第二章 职业道德规范', sectionName: '2.1 爱国守法', type: '图文', materials: 0, learners: 330, rate: 96.5 },
    { chapterName: '第二章 职业道德规范', sectionName: '2.2 爱岗敬业', type: '文档', materials: 3, learners: 325, rate: 95.0 }
  ]
};

const MOCK_TEACHER_STATS = {
  c1: [
    { id: 't1', name: '张老师', phone: '13812345678', org: '语文教研组', stage: '初中', grade: '七年级', subject: '语文', progress: '8/8', status: 'completed', lastLearnTime: '2025-05-25 15:30:00' },
    { id: 't2', name: '李老师', phone: '13987654321', org: '数学教研组', stage: '初中', grade: '八年级', subject: '数学', progress: '7/8', status: 'incomplete', lastLearnTime: '2025-05-24 10:20:00' },
    { id: 't3', name: '王老师', phone: '13711112222', org: '英语教研组', stage: '小学', grade: '五年级', subject: '英语', progress: '5/8', status: 'incomplete', lastLearnTime: '2025-05-23 09:15:00' },
    { id: 't4', name: '赵老师', phone: '13622223333', org: '物理教研组', stage: '高中', grade: '高一', subject: '物理', progress: '8/8', status: 'completed', lastLearnTime: '2025-05-22 16:45:00' },
    { id: 't5', name: '刘老师', phone: '13533334444', org: '化学教研组', stage: '高中', grade: '高二', subject: '化学', progress: '3/8', status: 'incomplete', lastLearnTime: '2025-05-21 14:10:00' }
  ]
};

const MOCK_TEACHER_DETAIL = {
  t1: {
    name: '张老师',
    phone: '13812345678',
    totalSections: 8,
    learnedSections: 8,
    completionRate: 100,
    totalMaterials: 12,
    sectionDetails: [
      { chapterName: '第一章 职业道德概述', sectionName: '1.1 职业道德的定义与内涵', materials: 2, status: 'completed', lastTime: '2025-05-20 10:00:00', duration: '0时45分30秒' },
      { chapterName: '第一章 职业道德概述', sectionName: '1.2 教师职业道德的历史演变', materials: 1, status: 'completed', lastTime: '2025-05-21 14:20:00', duration: '1时20分15秒' },
      { chapterName: '第二章 职业道德规范', sectionName: '2.1 爱国守法', materials: 0, status: 'completed', lastTime: '2025-05-22 09:30:00', duration: '0时30分00秒' },
      { chapterName: '第二章 职业道德规范', sectionName: '2.2 爱岗敬业', materials: 3, status: 'completed', lastTime: '2025-05-23 16:00:00', duration: '0时55分45秒' }
    ]
  },
  t2: {
    name: '李老师',
    phone: '13987654321',
    totalSections: 8,
    learnedSections: 7,
    completionRate: 87.5,
    totalMaterials: 12,
    sectionDetails: [
      { chapterName: '第一章 职业道德概述', sectionName: '1.1 职业道德的定义与内涵', materials: 2, status: 'completed', lastTime: '2025-05-18 10:00:00', duration: '0时40分20秒' },
      { chapterName: '第一章 职业道德概述', sectionName: '1.2 教师职业道德的历史演变', materials: 1, status: 'completed', lastTime: '2025-05-19 14:20:00', duration: '1时15分00秒' },
      { chapterName: '第二章 职业道德规范', sectionName: '2.1 爱国守法', materials: 0, status: 'completed', lastTime: '2025-05-20 09:30:00', duration: '0时25分10秒' },
      { chapterName: '第二章 职业道德规范', sectionName: '2.2 爱岗敬业', materials: 3, status: 'incomplete', lastTime: '-', duration: '-' }
    ]
  }
};

const MOCK_COURSE_TYPE_TREE = [
  {
    id: 'ct1',
    name: '师德师风',
    courseCount: 12,
    children: [
      { id: 'ct1-1', name: '职业道德', courseCount: 5, children: [] },
      { id: 'ct1-2', name: '师风建设', courseCount: 7, children: [] }
    ]
  },
  {
    id: 'ct2',
    name: '教学能力',
    courseCount: 28,
    children: [
      { id: 'ct2-1', name: '教学设计', courseCount: 10, children: [] },
      { id: 'ct2-2', name: '课堂管理', courseCount: 8, children: [] },
      { id: 'ct2-3', name: '教学评价', courseCount: 10, children: [] }
    ]
  },
  {
    id: 'ct3',
    name: '信息技术',
    courseCount: 15,
    children: [
      { id: 'ct3-1', name: '智慧课堂', courseCount: 8, children: [] },
      { id: 'ct3-2', name: 'AI应用', courseCount: 7, children: [] }
    ]
  },
  {
    id: 'ct4',
    name: '心理健康',
    courseCount: 6,
    children: []
  }
];

const MOCK_TEACHERS = [
  { id: 't1', name: '张老师', phone: '13812345678', org: 'o1-1', orgName: '教学研究组', grade: '七年级', subject: '语文' },
  { id: 't2', name: '李老师', phone: '13987654321', org: 'o1-1', orgName: '教学研究组', grade: '八年级', subject: '数学' },
  { id: 't3', name: '王老师', phone: '13711112222', org: 'o1-1', orgName: '教学研究组', grade: '五年级', subject: '英语' },
  { id: 't4', name: '赵老师', phone: '13622223333', org: 'o1-2', orgName: '课程开发组', grade: '高一', subject: '物理' },
  { id: 't5', name: '刘老师', phone: '13533334444', org: 'o1-2', orgName: '课程开发组', grade: '高二', subject: '化学' },
  { id: 't6', name: '陈老师', phone: '13444445555', org: 'o2-1', orgName: '新教师培训部', grade: '三年级', subject: '语文' },
  { id: 't7', name: '杨老师', phone: '13355556666', org: 'o2-1', orgName: '新教师培训部', grade: '四年级', subject: '数学' },
  { id: 't8', name: '黄老师', phone: '13266667777', org: 'o2-2', orgName: '骨干教师培训部', grade: '九年级', subject: '英语' },
  { id: 't9', name: '周老师', phone: '13177778888', org: 'o2-2', orgName: '骨干教师培训部', grade: '高三', subject: '物理' },
  { id: 't10', name: '吴老师', phone: '13088889999', org: 'o3', orgName: '信息中心', grade: '六年级', subject: '信息技术' },
  { id: 't11', name: '郑老师', phone: '13800001111', org: 'o1-1', orgName: '教学研究组', grade: '七年级', subject: '历史' },
  { id: 't12', name: '孙老师', phone: '13800002222', org: 'o1-2', orgName: '课程开发组', grade: '八年级', subject: '地理' },
  { id: 't13', name: '马老师', phone: '13800003333', org: 'o2-1', orgName: '新教师培训部', grade: '一年级', subject: '语文' },
  { id: 't14', name: '朱老师', phone: '13800004444', org: 'o2-2', orgName: '骨干教师培训部', grade: '二年级', subject: '数学' },
  { id: 't15', name: '胡老师', phone: '13800005555', org: 'o3', orgName: '信息中心', grade: '高一', subject: '信息技术' }
];

const MOCK_ACTIVITIES = [
  {
    id: 'a1',
    name: '2025暑期教师专业能力提升培训',
    cover: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&h=225&fit=crop',
    startTime: '2025-06-15',
    endTime: '2025-08-31',
    status: 'ongoing',
    requireHours: 12.0,
    hasHours: true,
    studyMode: 'complete',
    participants: ['t1', 't2', 't3', 't4', 't5', 't6', 't7', 't8', 't9', 't10']
  },
  {
    id: 'a2',
    name: '信息化教学工具应用培训',
    cover: 'https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=400&h=225&fit=crop',
    startTime: '2025-05-01',
    endTime: '2025-05-31',
    status: 'ended',
    requireHours: 8.0,
    hasHours: true,
    studyMode: 'view',
    participants: ['t1', 't2', 't3', 't4', 't5', 't6', 't7', 't8']
  },
  {
    id: 'a3',
    name: '新教师入职培训（2025春）',
    cover: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400&h=225&fit=crop',
    startTime: '2025-09-01',
    endTime: '2025-10-15',
    status: 'upcoming',
    requireHours: 16.0,
    hasHours: true,
    studyMode: 'feedback',
    participants: ['t6', 't7', 't13']
  },
  {
    id: 'a4',
    name: '师德师风专题学习',
    cover: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400&h=225&fit=crop',
    startTime: '2025-04-01',
    endTime: '2025-04-30',
    status: 'ended',
    requireHours: 4.0,
    hasHours: true,
    studyMode: 'complete',
    participants: ['t1', 't2', 't3', 't4', 't5', 't6', 't7', 't8', 't9', 't10', 't11', 't12', 't13', 't14', 't15']
  },
  {
    id: 'a5',
    name: 'AI赋能教育创新研讨',
    cover: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=400&h=225&fit=crop',
    startTime: '2025-07-01',
    endTime: '2025-07-15',
    status: 'upcoming',
    hasHours: false,
    studyMode: 'view',
    participants: ['t1', 't2', 't3', 't4', 't5']
  },
  {
    id: 'a6',
    name: '教学评价与反馈策略工作坊',
    cover: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=225&fit=crop',
    startTime: '2025-08-01',
    endTime: '2025-08-20',
    status: 'upcoming',
    requireHours: 10.0,
    hasHours: true,
    studyMode: 'complete',
    participants: ['t1', 't2', 't3', 't4', 't5', 't6', 't7', 't8', 't9', 't10', 't11', 't12']
  },
  {
    id: 'a7',
    name: '班级管理与学生心理辅导',
    cover: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=400&h=225&fit=crop',
    startTime: '2025-03-01',
    endTime: '2025-03-31',
    status: 'ended',
    requireHours: 6.0,
    hasHours: true,
    studyMode: 'complete',
    participants: ['t1', 't2', 't3', 't4', 't5', 't6', 't7', 't8']
  },
  {
    id: 'a8',
    name: '新课标解读与实施路径',
    cover: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400&h=225&fit=crop',
    startTime: '2025-09-10',
    endTime: '2025-10-10',
    status: 'upcoming',
    requireHours: 8.0,
    hasHours: true,
    studyMode: 'feedback',
    participants: ['t1', 't2', 't3', 't4', 't5', 't6', 't7', 't8', 't9', 't10']
  },
  {
    id: 'a9',
    name: '作业设计与布置技巧',
    cover: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400&h=225&fit=crop',
    startTime: '2025-02-15',
    endTime: '2025-03-15',
    status: 'ended',
    requireHours: 5.0,
    hasHours: true,
    studyMode: 'complete',
    participants: ['t1', 't2', 't3', 't4', 't5', 't6', 't7']
  },
  {
    id: 'a10',
    name: '教育科研方法与论文写作',
    cover: 'https://images.unsplash.com/photo-1456324504439-367cee3b3c32?w=400&h=225&fit=crop',
    startTime: '2025-11-01',
    endTime: '2025-12-01',
    status: 'upcoming',
    requireHours: 12.0,
    hasHours: true,
    studyMode: 'complete',
    participants: ['t1', 't2', 't3', 't4', 't5', 't6', 't7', 't8', 't9', 't10', 't11', 't12', 't13', 't14', 't15']
  }
];

const MOCK_ACTIVITY_COURSES = {
  a1: [
    { courseId: 'c1', name: '新时代教师职业道德规范', typeName: '师德师风 / 职业道德', instructor: '王晓明 / 教育部教师发展中心', hours: 3.0 },
    { courseId: 'c2', name: '智慧课堂教学设计与实践', typeName: '信息技术 / 智慧课堂', instructor: '张晓燕 / 智慧教育研究院', hours: 4.0 },
    { courseId: 'c4', name: '学生心理健康辅导技巧', typeName: '心理健康', instructor: '刘心理 / 心理咨询中心', hours: 2.0 },
    { courseId: 'c3', name: 'AI赋能教学创新', typeName: '信息技术 / AI应用', instructor: '陈技术 / AI教育实验室', hours: 3.0 }
  ],
  a2: [
    { courseId: 'c2', name: '智慧课堂教学设计与实践', typeName: '信息技术 / 智慧课堂', instructor: '张晓燕 / 智慧教育研究院', hours: 4.0 },
    { courseId: 'c3', name: 'AI赋能教学创新', typeName: '信息技术 / AI应用', instructor: '陈技术 / AI教育实验室', hours: 4.0 }
  ],
  a3: [
    { courseId: 'c1', name: '新时代教师职业道德规范', typeName: '师德师风 / 职业道德', instructor: '王晓明 / 教育部教师发展中心', hours: 4.0 },
    { courseId: 'c2', name: '智慧课堂教学设计与实践', typeName: '信息技术 / 智慧课堂', instructor: '张晓燕 / 智慧教育研究院', hours: 4.0 },
    { courseId: 'c4', name: '学生心理健康辅导技巧', typeName: '心理健康', instructor: '刘心理 / 心理咨询中心', hours: 4.0 },
    { courseId: 'c5', name: '高效课堂教学管理策略', typeName: '教学能力 / 课堂管理', instructor: '孙管理 / 教学管理研究所', hours: 4.0 }
  ],
  a4: [
    { courseId: 'c1', name: '新时代教师职业道德规范', typeName: '师德师风 / 职业道德', instructor: '王晓明 / 教育部教师发展中心', hours: 4.0 }
  ],
  a5: [
    { courseId: 'c3', name: 'AI赋能教学创新', typeName: '信息技术 / AI应用', instructor: '陈技术 / AI教育实验室', hours: 0 },
    { courseId: 'c2', name: '智慧课堂教学设计与实践', typeName: '信息技术 / 智慧课堂', instructor: '张晓燕 / 智慧教育研究院', hours: 0 }
  ],
  a6: [
    { courseId: 'c5', name: '高效课堂教学管理策略', typeName: '教学能力 / 课堂管理', instructor: '孙管理 / 教学管理研究所', hours: 4.0 },
    { courseId: 'c2', name: '智慧课堂教学设计与实践', typeName: '信息技术 / 智慧课堂', instructor: '张晓燕 / 智慧教育研究院', hours: 4.0 },
    { courseId: 'c4', name: '学生心理健康辅导技巧', typeName: '心理健康', instructor: '刘心理 / 心理咨询中心', hours: 2.0 }
  ],
  a7: [
    { courseId: 'c4', name: '学生心理健康辅导技巧', typeName: '心理健康', instructor: '刘心理 / 心理咨询中心', hours: 3.0 },
    { courseId: 'c5', name: '高效课堂教学管理策略', typeName: '教学能力 / 课堂管理', instructor: '孙管理 / 教学管理研究所', hours: 3.0 }
  ],
  a8: [
    { courseId: 'c1', name: '新时代教师职业道德规范', typeName: '师德师风 / 职业道德', instructor: '王晓明 / 教育部教师发展中心', hours: 4.0 },
    { courseId: 'c2', name: '智慧课堂教学设计与实践', typeName: '信息技术 / 智慧课堂', instructor: '张晓燕 / 智慧教育研究院', hours: 4.0 }
  ],
  a9: [
    { courseId: 'c5', name: '高效课堂教学管理策略', typeName: '教学能力 / 课堂管理', instructor: '孙管理 / 教学管理研究所', hours: 2.5 },
    { courseId: 'c2', name: '智慧课堂教学设计与实践', typeName: '信息技术 / 智慧课堂', instructor: '张晓燕 / 智慧教育研究院', hours: 2.5 }
  ],
  a10: [
    { courseId: 'c1', name: '新时代教师职业道德规范', typeName: '师德师风 / 职业道德', instructor: '王晓明 / 教育部教师发展中心', hours: 4.0 },
    { courseId: 'c3', name: 'AI赋能教学创新', typeName: '信息技术 / AI应用', instructor: '陈技术 / AI教育实验室', hours: 4.0 },
    { courseId: 'c4', name: '学生心理健康辅导技巧', typeName: '心理健康', instructor: '刘心理 / 心理咨询中心', hours: 4.0 }
  ]
};

const MOCK_ACTIVITY_PARTICIPANTS = {
  a1: [
    { teacherId: 't1', learnedCourses: 3, earnedHours: 9.0, completed: false, lastLearnTime: '2025-06-20 15:30:00' },
    { teacherId: 't2', learnedCourses: 4, earnedHours: 12.0, completed: true, lastLearnTime: '2025-06-22 10:20:00' },
    { teacherId: 't3', learnedCourses: 2, earnedHours: 5.0, completed: false, lastLearnTime: '2025-06-18 09:15:00' },
    { teacherId: 't4', learnedCourses: 4, earnedHours: 12.0, completed: true, lastLearnTime: '2025-06-21 16:45:00' },
    { teacherId: 't5', learnedCourses: 1, earnedHours: 2.0, completed: false, lastLearnTime: '2025-06-15 14:10:00' },
    { teacherId: 't6', learnedCourses: 3, earnedHours: 7.0, completed: false, lastLearnTime: '2025-06-19 11:30:00' },
    { teacherId: 't7', learnedCourses: 4, earnedHours: 12.0, completed: true, lastLearnTime: '2025-06-23 08:45:00' },
    { teacherId: 't8', learnedCourses: 2, earnedHours: 4.0, completed: false, lastLearnTime: '2025-06-17 13:20:00' },
    { teacherId: 't9', learnedCourses: 3, earnedHours: 8.0, completed: false, lastLearnTime: '2025-06-16 17:00:00' },
    { teacherId: 't10', learnedCourses: 4, earnedHours: 12.0, completed: true, lastLearnTime: '2025-06-22 09:00:00' }
  ],
  a2: [
    { teacherId: 't1', learnedCourses: 2, earnedHours: 8.0, completed: true, lastLearnTime: '2025-05-20 14:30:00' },
    { teacherId: 't2', learnedCourses: 2, earnedHours: 8.0, completed: true, lastLearnTime: '2025-05-18 10:20:00' },
    { teacherId: 't3', learnedCourses: 1, earnedHours: 4.0, completed: false, lastLearnTime: '2025-05-15 09:15:00' },
    { teacherId: 't4', learnedCourses: 2, earnedHours: 8.0, completed: true, lastLearnTime: '2025-05-22 16:45:00' },
    { teacherId: 't5', learnedCourses: 2, earnedHours: 8.0, completed: true, lastLearnTime: '2025-05-25 14:10:00' },
    { teacherId: 't6', learnedCourses: 1, earnedHours: 4.0, completed: false, lastLearnTime: '2025-05-12 11:30:00' },
    { teacherId: 't7', learnedCourses: 2, earnedHours: 8.0, completed: true, lastLearnTime: '2025-05-28 08:45:00' },
    { teacherId: 't8', learnedCourses: 2, earnedHours: 8.0, completed: true, lastLearnTime: '2025-05-26 13:20:00' }
  ],
  a3: [
    { teacherId: 't6', learnedCourses: 0, earnedHours: 0, completed: false, lastLearnTime: '-' },
    { teacherId: 't7', learnedCourses: 0, earnedHours: 0, completed: false, lastLearnTime: '-' },
    { teacherId: 't13', learnedCourses: 0, earnedHours: 0, completed: false, lastLearnTime: '-' }
  ],
  a4: [
    { teacherId: 't1', learnedCourses: 1, earnedHours: 4.0, completed: true, lastLearnTime: '2025-04-20 15:30:00' },
    { teacherId: 't2', learnedCourses: 1, earnedHours: 4.0, completed: true, lastLearnTime: '2025-04-18 10:20:00' },
    { teacherId: 't3', learnedCourses: 1, earnedHours: 4.0, completed: true, lastLearnTime: '2025-04-22 09:15:00' },
    { teacherId: 't4', learnedCourses: 1, earnedHours: 4.0, completed: true, lastLearnTime: '2025-04-25 16:45:00' },
    { teacherId: 't5', learnedCourses: 1, earnedHours: 4.0, completed: true, lastLearnTime: '2025-04-28 14:10:00' },
    { teacherId: 't6', learnedCourses: 1, earnedHours: 4.0, completed: true, lastLearnTime: '2025-04-15 11:30:00' },
    { teacherId: 't7', learnedCourses: 1, earnedHours: 4.0, completed: true, lastLearnTime: '2025-04-19 08:45:00' },
    { teacherId: 't8', learnedCourses: 1, earnedHours: 4.0, completed: true, lastLearnTime: '2025-04-21 13:20:00' },
    { teacherId: 't9', learnedCourses: 1, earnedHours: 4.0, completed: true, lastLearnTime: '2025-04-23 17:00:00' },
    { teacherId: 't10', learnedCourses: 1, earnedHours: 4.0, completed: true, lastLearnTime: '2025-04-24 09:00:00' },
    { teacherId: 't11', learnedCourses: 1, earnedHours: 4.0, completed: true, lastLearnTime: '2025-04-26 10:30:00' },
    { teacherId: 't12', learnedCourses: 1, earnedHours: 4.0, completed: true, lastLearnTime: '2025-04-27 14:00:00' },
    { teacherId: 't13', learnedCourses: 1, earnedHours: 4.0, completed: true, lastLearnTime: '2025-04-29 11:00:00' },
    { teacherId: 't14', learnedCourses: 1, earnedHours: 4.0, completed: true, lastLearnTime: '2025-04-30 15:00:00' },
    { teacherId: 't15', learnedCourses: 1, earnedHours: 4.0, completed: true, lastLearnTime: '2025-04-16 16:30:00' }
  ],
  a5: [
    { teacherId: 't1', learnedCourses: 0, earnedHours: 0, completed: false, lastLearnTime: '-' },
    { teacherId: 't2', learnedCourses: 0, earnedHours: 0, completed: false, lastLearnTime: '-' },
    { teacherId: 't3', learnedCourses: 0, earnedHours: 0, completed: false, lastLearnTime: '-' },
    { teacherId: 't4', learnedCourses: 0, earnedHours: 0, completed: false, lastLearnTime: '-' },
    { teacherId: 't5', learnedCourses: 0, earnedHours: 0, completed: false, lastLearnTime: '-' }
  ],
  a6: [
    { teacherId: 't1', learnedCourses: 2, earnedHours: 8.0, completed: false, lastLearnTime: '2025-08-10 14:30:00' },
    { teacherId: 't2', learnedCourses: 3, earnedHours: 10.0, completed: true, lastLearnTime: '2025-08-15 10:20:00' },
    { teacherId: 't3', learnedCourses: 1, earnedHours: 4.0, completed: false, lastLearnTime: '2025-08-08 09:15:00' },
    { teacherId: 't4', learnedCourses: 3, earnedHours: 10.0, completed: true, lastLearnTime: '2025-08-12 16:45:00' },
    { teacherId: 't5', learnedCourses: 2, earnedHours: 6.0, completed: false, lastLearnTime: '2025-08-05 14:10:00' },
    { teacherId: 't6', learnedCourses: 2, earnedHours: 8.0, completed: false, lastLearnTime: '2025-08-11 11:30:00' },
    { teacherId: 't7', learnedCourses: 3, earnedHours: 10.0, completed: true, lastLearnTime: '2025-08-18 08:45:00' },
    { teacherId: 't8', learnedCourses: 1, earnedHours: 4.0, completed: false, lastLearnTime: '2025-08-09 13:20:00' },
    { teacherId: 't9', learnedCourses: 2, earnedHours: 8.0, completed: false, lastLearnTime: '2025-08-14 17:00:00' },
    { teacherId: 't10', learnedCourses: 3, earnedHours: 10.0, completed: true, lastLearnTime: '2025-08-16 09:00:00' },
    { teacherId: 't11', learnedCourses: 2, earnedHours: 8.0, completed: false, lastLearnTime: '2025-08-13 10:30:00' },
    { teacherId: 't12', learnedCourses: 3, earnedHours: 10.0, completed: true, lastLearnTime: '2025-08-17 14:00:00' }
  ],
  a7: [
    { teacherId: 't1', learnedCourses: 2, earnedHours: 6.0, completed: true, lastLearnTime: '2025-03-20 15:30:00' },
    { teacherId: 't2', learnedCourses: 2, earnedHours: 6.0, completed: true, lastLearnTime: '2025-03-18 10:20:00' },
    { teacherId: 't3', learnedCourses: 1, earnedHours: 3.0, completed: false, lastLearnTime: '2025-03-15 09:15:00' },
    { teacherId: 't4', learnedCourses: 2, earnedHours: 6.0, completed: true, lastLearnTime: '2025-03-22 16:45:00' },
    { teacherId: 't5', learnedCourses: 2, earnedHours: 6.0, completed: true, lastLearnTime: '2025-03-25 14:10:00' },
    { teacherId: 't6', learnedCourses: 1, earnedHours: 3.0, completed: false, lastLearnTime: '2025-03-12 11:30:00' },
    { teacherId: 't7', learnedCourses: 2, earnedHours: 6.0, completed: true, lastLearnTime: '2025-03-28 08:45:00' },
    { teacherId: 't8', learnedCourses: 2, earnedHours: 6.0, completed: true, lastLearnTime: '2025-03-26 13:20:00' }
  ],
  a8: [
    { teacherId: 't1', learnedCourses: 1, earnedHours: 4.0, completed: false, lastLearnTime: '2025-09-15 14:30:00' },
    { teacherId: 't2', learnedCourses: 2, earnedHours: 8.0, completed: false, lastLearnTime: '2025-09-18 10:20:00' },
    { teacherId: 't3', learnedCourses: 1, earnedHours: 4.0, completed: false, lastLearnTime: '2025-09-12 09:15:00' },
    { teacherId: 't4', learnedCourses: 2, earnedHours: 8.0, completed: false, lastLearnTime: '2025-09-20 16:45:00' },
    { teacherId: 't5', learnedCourses: 1, earnedHours: 4.0, completed: false, lastLearnTime: '2025-09-14 14:10:00' },
    { teacherId: 't6', learnedCourses: 1, earnedHours: 4.0, completed: false, lastLearnTime: '2025-09-16 11:30:00' },
    { teacherId: 't7', learnedCourses: 2, earnedHours: 8.0, completed: false, lastLearnTime: '2025-09-22 08:45:00' },
    { teacherId: 't8', learnedCourses: 1, earnedHours: 4.0, completed: false, lastLearnTime: '2025-09-17 13:20:00' },
    { teacherId: 't9', learnedCourses: 1, earnedHours: 4.0, completed: false, lastLearnTime: '2025-09-19 17:00:00' },
    { teacherId: 't10', learnedCourses: 2, earnedHours: 8.0, completed: false, lastLearnTime: '2025-09-21 09:00:00' }
  ],
  a9: [
    { teacherId: 't1', learnedCourses: 2, earnedHours: 5.0, completed: true, lastLearnTime: '2025-02-28 15:30:00' },
    { teacherId: 't2', learnedCourses: 2, earnedHours: 5.0, completed: true, lastLearnTime: '2025-02-25 10:20:00' },
    { teacherId: 't3', learnedCourses: 1, earnedHours: 2.5, completed: false, lastLearnTime: '2025-02-20 09:15:00' },
    { teacherId: 't4', learnedCourses: 2, earnedHours: 5.0, completed: true, lastLearnTime: '2025-03-05 16:45:00' },
    { teacherId: 't5', learnedCourses: 2, earnedHours: 5.0, completed: true, lastLearnTime: '2025-03-08 14:10:00' },
    { teacherId: 't6', learnedCourses: 1, earnedHours: 2.5, completed: false, lastLearnTime: '2025-02-18 11:30:00' },
    { teacherId: 't7', learnedCourses: 2, earnedHours: 5.0, completed: true, lastLearnTime: '2025-03-10 08:45:00' }
  ],
  a10: [
    { teacherId: 't1', learnedCourses: 2, earnedHours: 8.0, completed: false, lastLearnTime: '2025-11-15 14:30:00' },
    { teacherId: 't2', learnedCourses: 3, earnedHours: 12.0, completed: false, lastLearnTime: '2025-11-18 10:20:00' },
    { teacherId: 't3', learnedCourses: 1, earnedHours: 4.0, completed: false, lastLearnTime: '2025-11-12 09:15:00' },
    { teacherId: 't4', learnedCourses: 2, earnedHours: 8.0, completed: false, lastLearnTime: '2025-11-20 16:45:00' },
    { teacherId: 't5', learnedCourses: 2, earnedHours: 8.0, completed: false, lastLearnTime: '2025-11-14 14:10:00' },
    { teacherId: 't6', learnedCourses: 1, earnedHours: 4.0, completed: false, lastLearnTime: '2025-11-16 11:30:00' },
    { teacherId: 't7', learnedCourses: 2, earnedHours: 8.0, completed: false, lastLearnTime: '2025-11-22 08:45:00' },
    { teacherId: 't8', learnedCourses: 1, earnedHours: 4.0, completed: false, lastLearnTime: '2025-11-17 13:20:00' },
    { teacherId: 't9', learnedCourses: 1, earnedHours: 4.0, completed: false, lastLearnTime: '2025-11-19 17:00:00' },
    { teacherId: 't10', learnedCourses: 2, earnedHours: 8.0, completed: false, lastLearnTime: '2025-11-21 09:00:00' },
    { teacherId: 't11', learnedCourses: 1, earnedHours: 4.0, completed: false, lastLearnTime: '2025-11-23 10:30:00' },
    { teacherId: 't12', learnedCourses: 2, earnedHours: 8.0, completed: false, lastLearnTime: '2025-11-24 14:00:00' },
    { teacherId: 't13', learnedCourses: 1, earnedHours: 4.0, completed: false, lastLearnTime: '2025-11-25 11:00:00' },
    { teacherId: 't14', learnedCourses: 2, earnedHours: 8.0, completed: false, lastLearnTime: '2025-11-26 15:00:00' },
    { teacherId: 't15', learnedCourses: 1, earnedHours: 4.0, completed: false, lastLearnTime: '2025-11-27 16:30:00' }
  ]
};

const MOCK_ACTIVITY_LEARNING_RECORDS = {
  a1: [
    { teacherId: 't1', courseName: '新时代教师职业道德规范', hours: 3.0, completeTime: '2025-06-18 10:00:00', feedback: '内容详实，受益匪浅' },
    { teacherId: 't1', courseName: '智慧课堂教学设计与实践', hours: 4.0, completeTime: '2025-06-20 15:30:00', feedback: '实用性强，对教学很有帮助' },
    { teacherId: 't1', courseName: '学生心理健康辅导技巧', hours: 2.0, completeTime: '2025-06-19 09:00:00', feedback: '' },
    { teacherId: 't2', courseName: '新时代教师职业道德规范', hours: 3.0, completeTime: '2025-06-16 14:00:00', feedback: '很好' },
    { teacherId: 't2', courseName: '智慧课堂教学设计与实践', hours: 4.0, completeTime: '2025-06-18 10:30:00', feedback: '非常有用' },
    { teacherId: 't2', courseName: '学生心理健康辅导技巧', hours: 2.0, completeTime: '2025-06-19 16:00:00', feedback: '' },
    { teacherId: 't2', courseName: 'AI赋能教学创新', hours: 3.0, completeTime: '2025-06-22 10:20:00', feedback: '前沿内容' }
  ],
  a2: [
    { teacherId: 't1', courseName: '智慧课堂教学设计与实践', hours: 4.0, completeTime: '2025-05-15 11:00:00', feedback: '' },
    { teacherId: 't1', courseName: 'AI赋能教学创新', hours: 4.0, completeTime: '2025-05-20 14:30:00', feedback: '很实用' },
    { teacherId: 't2', courseName: '智慧课堂教学设计与实践', hours: 4.0, completeTime: '2025-05-12 09:30:00', feedback: '' },
    { teacherId: 't2', courseName: 'AI赋能教学创新', hours: 4.0, completeTime: '2025-05-18 10:20:00', feedback: '' }
  ],
  a4: [
    { teacherId: 't1', courseName: '新时代教师职业道德规范', hours: 4.0, completeTime: '2025-04-20 15:30:00', feedback: '深刻理解了职业道德规范' },
    { teacherId: 't2', courseName: '新时代教师职业道德规范', hours: 4.0, completeTime: '2025-04-18 10:20:00', feedback: '受益匪浅' }
  ],
  a6: [
    { teacherId: 't2', courseName: '高效课堂教学管理策略', hours: 4.0, completeTime: '2025-08-12 10:00:00', feedback: '管理策略很实用' },
    { teacherId: 't2', courseName: '智慧课堂教学设计与实践', hours: 4.0, completeTime: '2025-08-14 15:30:00', feedback: '' },
    { teacherId: 't2', courseName: '学生心理健康辅导技巧', hours: 2.0, completeTime: '2025-08-15 09:00:00', feedback: '对心理辅导有了新认识' },
    { teacherId: 't4', courseName: '高效课堂教学管理策略', hours: 4.0, completeTime: '2025-08-10 14:00:00', feedback: '' },
    { teacherId: 't4', courseName: '智慧课堂教学设计与实践', hours: 4.0, completeTime: '2025-08-13 10:30:00', feedback: '设计思路清晰' },
    { teacherId: 't4', courseName: '学生心理健康辅导技巧', hours: 2.0, completeTime: '2025-08-16 16:00:00', feedback: '' },
    { teacherId: 't7', courseName: '高效课堂教学管理策略', hours: 4.0, completeTime: '2025-08-15 11:00:00', feedback: '' },
    { teacherId: 't7', courseName: '智慧课堂教学设计与实践', hours: 4.0, completeTime: '2025-08-17 14:30:00', feedback: '收获很大' },
    { teacherId: 't7', courseName: '学生心理健康辅导技巧', hours: 2.0, completeTime: '2025-08-18 09:00:00', feedback: '' },
    { teacherId: 't10', courseName: '高效课堂教学管理策略', hours: 4.0, completeTime: '2025-08-14 13:00:00', feedback: '' },
    { teacherId: 't10', courseName: '智慧课堂教学设计与实践', hours: 4.0, completeTime: '2025-08-16 10:00:00', feedback: '' },
    { teacherId: 't10', courseName: '学生心理健康辅导技巧', hours: 2.0, completeTime: '2025-08-18 11:00:00', feedback: '' },
    { teacherId: 't12', courseName: '高效课堂教学管理策略', hours: 4.0, completeTime: '2025-08-16 15:00:00', feedback: '' },
    { teacherId: 't12', courseName: '智慧课堂教学设计与实践', hours: 4.0, completeTime: '2025-08-17 09:30:00', feedback: '' },
    { teacherId: 't12', courseName: '学生心理健康辅导技巧', hours: 2.0, completeTime: '2025-08-18 14:00:00', feedback: '' }
  ],
  a7: [
    { teacherId: 't1', courseName: '学生心理健康辅导技巧', hours: 3.0, completeTime: '2025-03-20 15:30:00', feedback: '' },
    { teacherId: 't1', courseName: '高效课堂教学管理策略', hours: 3.0, completeTime: '2025-03-22 10:00:00', feedback: '' },
    { teacherId: 't2', courseName: '学生心理健康辅导技巧', hours: 3.0, completeTime: '2025-03-18 14:00:00', feedback: '' },
    { teacherId: 't2', courseName: '高效课堂教学管理策略', hours: 3.0, completeTime: '2025-03-20 10:30:00', feedback: '' },
    { teacherId: 't4', courseName: '学生心理健康辅导技巧', hours: 3.0, completeTime: '2025-03-25 16:00:00', feedback: '' },
    { teacherId: 't4', courseName: '高效课堂教学管理策略', hours: 3.0, completeTime: '2025-03-28 09:00:00', feedback: '' },
    { teacherId: 't5', courseName: '学生心理健康辅导技巧', hours: 3.0, completeTime: '2025-03-22 14:00:00', feedback: '' },
    { teacherId: 't5', courseName: '高效课堂教学管理策略', hours: 3.0, completeTime: '2025-03-24 11:00:00', feedback: '' },
    { teacherId: 't7', courseName: '学生心理健康辅导技巧', hours: 3.0, completeTime: '2025-03-26 15:00:00', feedback: '' },
    { teacherId: 't7', courseName: '高效课堂教学管理策略', hours: 3.0, completeTime: '2025-03-28 08:00:00', feedback: '' },
    { teacherId: 't8', courseName: '学生心理健康辅导技巧', hours: 3.0, completeTime: '2025-03-24 10:00:00', feedback: '' },
    { teacherId: 't8', courseName: '高效课堂教学管理策略', hours: 3.0, completeTime: '2025-03-26 13:00:00', feedback: '' }
  ],
  a8: [
    { teacherId: 't1', courseName: '新时代教师职业道德规范', hours: 4.0, completeTime: '2025-09-15 14:30:00', feedback: '' },
    { teacherId: 't2', courseName: '新时代教师职业道德规范', hours: 4.0, completeTime: '2025-09-18 10:00:00', feedback: '' },
    { teacherId: 't2', courseName: '智慧课堂教学设计与实践', hours: 4.0, completeTime: '2025-09-20 15:00:00', feedback: '' },
    { teacherId: 't4', courseName: '新时代教师职业道德规范', hours: 4.0, completeTime: '2025-09-20 16:00:00', feedback: '' },
    { teacherId: 't4', courseName: '智慧课堂教学设计与实践', hours: 4.0, completeTime: '2025-09-22 10:00:00', feedback: '' },
    { teacherId: 't7', courseName: '新时代教师职业道德规范', hours: 4.0, completeTime: '2025-09-22 08:00:00', feedback: '' },
    { teacherId: 't7', courseName: '智慧课堂教学设计与实践', hours: 4.0, completeTime: '2025-09-24 14:00:00', feedback: '' },
    { teacherId: 't10', courseName: '新时代教师职业道德规范', hours: 4.0, completeTime: '2025-09-21 09:00:00', feedback: '' },
    { teacherId: 't10', courseName: '智慧课堂教学设计与实践', hours: 4.0, completeTime: '2025-09-23 11:00:00', feedback: '' }
  ],
  a9: [
    { teacherId: 't1', courseName: '高效课堂教学管理策略', hours: 2.5, completeTime: '2025-02-28 15:00:00', feedback: '' },
    { teacherId: 't1', courseName: '智慧课堂教学设计与实践', hours: 2.5, completeTime: '2025-03-01 10:00:00', feedback: '' },
    { teacherId: 't2', courseName: '高效课堂教学管理策略', hours: 2.5, completeTime: '2025-02-25 14:00:00', feedback: '' },
    { teacherId: 't2', courseName: '智慧课堂教学设计与实践', hours: 2.5, completeTime: '2025-02-26 09:00:00', feedback: '' },
    { teacherId: 't4', courseName: '高效课堂教学管理策略', hours: 2.5, completeTime: '2025-03-05 16:00:00', feedback: '' },
    { teacherId: 't4', courseName: '智慧课堂教学设计与实践', hours: 2.5, completeTime: '2025-03-06 10:00:00', feedback: '' },
    { teacherId: 't5', courseName: '高效课堂教学管理策略', hours: 2.5, completeTime: '2025-03-08 14:00:00', feedback: '' },
    { teacherId: 't5', courseName: '智慧课堂教学设计与实践', hours: 2.5, completeTime: '2025-03-09 11:00:00', feedback: '' },
    { teacherId: 't7', courseName: '高效课堂教学管理策略', hours: 2.5, completeTime: '2025-03-10 15:00:00', feedback: '' },
    { teacherId: 't7', courseName: '智慧课堂教学设计与实践', hours: 2.5, completeTime: '2025-03-11 09:00:00', feedback: '' }
  ],
  a10: [
    { teacherId: 't2', courseName: '新时代教师职业道德规范', hours: 4.0, completeTime: '2025-11-18 10:00:00', feedback: '' },
    { teacherId: 't2', courseName: 'AI赋能教学创新', hours: 4.0, completeTime: '2025-11-20 15:00:00', feedback: '' },
    { teacherId: 't2', courseName: '学生心理健康辅导技巧', hours: 4.0, completeTime: '2025-11-22 09:00:00', feedback: '' },
    { teacherId: 't4', courseName: '新时代教师职业道德规范', hours: 4.0, completeTime: '2025-11-20 16:00:00', feedback: '' },
    { teacherId: 't4', courseName: 'AI赋能教学创新', hours: 4.0, completeTime: '2025-11-22 10:00:00', feedback: '' },
    { teacherId: 't7', courseName: '新时代教师职业道德规范', hours: 4.0, completeTime: '2025-11-22 08:00:00', feedback: '' },
    { teacherId: 't7', courseName: 'AI赋能教学创新', hours: 4.0, completeTime: '2025-11-24 14:00:00', feedback: '' },
    { teacherId: 't10', courseName: '新时代教师职业道德规范', hours: 4.0, completeTime: '2025-11-21 09:00:00', feedback: '' },
    { teacherId: 't10', courseName: 'AI赋能教学创新', hours: 4.0, completeTime: '2025-11-23 11:00:00', feedback: '' },
    { teacherId: 't12', courseName: '新时代教师职业道德规范', hours: 4.0, completeTime: '2025-11-24 14:00:00', feedback: '' },
    { teacherId: 't12', courseName: 'AI赋能教学创新', hours: 4.0, completeTime: '2025-11-26 10:00:00', feedback: '' },
    { teacherId: 't14', courseName: '新时代教师职业道德规范', hours: 4.0, completeTime: '2025-11-26 15:00:00', feedback: '' },
    { teacherId: 't14', courseName: 'AI赋能教学创新', hours: 4.0, completeTime: '2025-11-28 11:00:00', feedback: '' }
  ]
};

const MOCK_HOT_WORDS = [
  { name: '新课标', value: 120 },
  { name: '智慧课堂', value: 98 },
  { name: '作业设计', value: 86 },
  { name: '教学评价', value: 75 },
  { name: '班级管理', value: 72 },
  { name: '信息化', value: 68 },
  { name: '师德师风', value: 65 },
  { name: '心理健康', value: 60 },
  { name: '教学设计', value: 58 },
  { name: '课堂互动', value: 55 },
  { name: 'AI应用', value: 52 },
  { name: '教学研究', value: 48 },
  { name: '微课制作', value: 45 },
  { name: '分层教学', value: 42 },
  { name: '核心素养', value: 40 },
  { name: '差异化', value: 38 },
  { name: '学情分析', value: 36 },
  { name: '翻转课堂', value: 34 },
  { name: '大单元', value: 32 },
  { name: '项目式学习', value: 30 },
  { name: '跨学科', value: 28 },
  { name: '教育技术', value: 26 },
  { name: '教师成长', value: 24 },
  { name: '减负增效', value: 22 },
  { name: '家校沟通', value: 20 },
];

const MOCK_HOT_QUESTIONS = [
  { name: '如何在课堂上有效落实新课标要求？', count: 156 },
  { name: '智慧课堂工具如何与学科教学深度融合？', count: 132 },
  { name: '双减背景下作业设计有哪些创新策略？', count: 118 },
  { name: '怎样进行科学的教学评价与学情分析？', count: 95 },
  { name: '班级管理中如何应对学生心理健康问题？', count: 87 },
];

const MOCK_ABILITY_DIMENSIONS = [
  { id: 'ability-interaction', name: '课堂互动', system: true },
  { id: 'ability-curriculum', name: '新课标解读', system: true },
  { id: 'ability-it', name: '信息化教学', system: true },
  { id: 'ability-management', name: '班级管理', system: true },
  { id: 'ability-homework', name: '作业设计', system: true },
  { id: 'ability-research', name: '教学研究', system: true },
  { id: 'ability-ai', name: 'AI应用', system: false }
];
