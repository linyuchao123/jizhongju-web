// Stable story identities. Titles may change; save keys and ownership must not.
export const STORY_ONE='palace-1',STORY_TWO='palace-2';
export const photoStory=photo=>photo.storyId||(photo.expedition===true?STORY_TWO:STORY_ONE);
export const photosForStory=(photos,storyId)=>photos.filter(photo=>photoStory(photo)===storyId);
export const STORY_VERSIONS=[{id:STORY_ONE,title:'颐和谜境（1）',subtitle:'样式雷手札 · 六幕分镜',cover:'/assets/palace/huazhongyou.webp',tag:'插画叙事 / 六幕体验',description:'从半本没有署名的手札开始，与阿衡辨别观察和传说，在湖山之间写下自己的结尾。',features:'六幕分镜 · 三种结局 · 插画信物'},{id:STORY_TWO,title:'颐和谜境（2）',subtitle:'样式雷手札 · 双线寻迹',cover:'/assets/expedition/tower.webp',tag:'实景探索 / A、B 双线',description:'从乐寿堂的太平暗语出发，循图纸或案牍追寻师父，在十七孔桥与铜牛揭开最后的留言。',features:'A/B 路线 · 实景互动 · 通关长卷'}];
