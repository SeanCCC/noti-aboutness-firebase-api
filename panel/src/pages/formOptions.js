const genderOptions = [
  { key: 'm', text: '男', value: 'male' },
  { key: 'f', text: '女', value: 'female' }
]

const boolOptions = [
  { key: 'true', text: '是', value: true },
  { key: 'false', text: '否', value: false }
]

const androidSystemVersion = [
  { key: 'notAndroid', text: '使用其他系統的手機', value: 'notAndroid' },
  { key: '4', text: '4以下', value: '4' },
  { key: '5', text: '5.x.x', value: '5' },
  { key: '6', text: '6.x.x', value: '6' },
  { key: '7', text: '7.x.x', value: '7' },
  { key: '8', text: '8.x.x', value: '8' },
  { key: '9', text: '9.x.x', value: '9' },
  { key: '10', text: '10.x.x', value: '10' }
]

const mobileOpitons = [
  { key: 'apple', text: '蘋果', value: 'apple' },
  { key: 'samsung', text: '三星', value: 'samsung' },
  { key: 'oppo', text: 'OPPO', value: 'oppo' },
  { key: 'asus', text: '華碩', value: 'asus' },
  { key: 'htc', text: 'HTC', value: 'htc' },
  { key: 'sony', text: 'Sony', value: 'sony' },
  { key: 'xiaomi', text: '小米', value: 'xiaomi' },
  { key: 'huawei', text: '華為', value: 'huawei' },
  { key: 'google', text: 'Google', value: 'google' },
  { key: 'lg', text: 'LG', value: 'lg' },
  { key: 'vivo', text: 'VIVO', value: 'vivo' },
  { key: 'other', text: '其他', value: 'other' }
]

const osOptions = [
  { key: 'android', text: 'Android', value: 'android' },
  { key: 'ios', text: 'iOS', value: 'ios' },
  { key: 'other', text: '其他', value: 'other' }
]

const cityOptions = [
  { key: 'keelung', text: '基隆市', value: 'keelung' },
  { key: 'taipei', text: '台北市', value: 'taipei' },
  { key: 'newTaipei', text: '新北市', value: 'newTaipei' },
  { key: 'taoyuan', text: '桃園市', value: 'taoyuan' },
  { key: 'hsinchuCity', text: '新竹市', value: 'hsinchuCity' },
  { key: 'hsinchuCounty', text: '新竹縣', value: 'hsinchuCounty' },
  { key: 'miaoli', text: '苗栗縣', value: 'miaoli' },
  { key: 'taichung', text: '台中市', value: 'taichung' },
  { key: 'changhua', text: '彰化縣', value: 'changhua' },
  { key: 'nantou', text: '南投縣', value: 'nantou' },
  { key: 'yunlin', text: '雲林縣', value: 'yunlin' },
  { key: 'chiayiCity', text: '嘉義市', value: 'chiayiCity' },
  { key: 'chiayiCounty', text: '嘉義縣', value: 'chiayiCounty' },
  { key: 'tainan', text: '台南市', value: 'tainan' },
  { key: 'kaohsiung', text: '高雄市', value: 'kaohsiung' },
  { key: 'pingtung', text: '屏東縣', value: 'pingtung' },
  { key: 'taitung', text: '台東縣', value: 'taitung' },
  { key: 'hualien', text: '花蓮縣', value: 'hualien' },
  { key: 'yilan', text: '宜蘭縣', value: 'yilan' },
  { key: 'penghu', text: '澎湖縣', value: 'penghu' },
  { key: 'kinmen', text: '金門縣', value: 'kinmen' },
  { key: 'lienchiang', text: '連江縣', value: 'lienchiang' }
]

const jobOptions = [
  { key: 'student', text: '學生', value: 'student' },
  { key: 'public', text: '軍公教', value: 'public' },
  { key: 'service', text: '服務業', value: 'service' },
  { key: 'tech', text: '資訊科技業', value: 'tech' },
  { key: 'media', text: '大眾傳播業', value: 'media' },
  { key: 'commerce', text: '商業', value: 'commerce' },
  { key: 'manufacture', text: '製造業', value: 'manufacture' },
  { key: 'freelancer', text: '自由業', value: 'freelancer' },
  { key: 'other', text: '其他', value: 'other' }
]

const networkAccessOptions = [
  { key: 'constantly', text: '幾乎無時無刻都連網路', value: 'constantly' },
  { key: 'serveralTimesADay', text: '一天好幾次', value: 'serveralTimesADay' },
  { key: 'onceADay', text: '大約一天一次', value: 'onceADay' },
  { key: 'serveralTimesAWeek', text: '一週好幾次', value: 'serveralTimesAWeek' },
  { key: 'onceAWeek', text: '大約一週一次', value: 'onceAWeek' },
  { key: 'lessThanOnceAWeek', text: '少於一週一次', value: 'lessThanOnceAWeek' },
  { key: 'notSure', text: '不確定', value: 'notSure' }
]

const networkLimit = [
  { key: 'none', text: '沒有搭配數據方案', value: 'none' },
  { key: '250MB', text: '不超過250MB', value: '250MB' },
  { key: '500MB', text: '介於251MB至500MB之間', value: '500MB' },
  { key: '1GB', text: '介於501MB至1GB之間', value: '1GB' },
  { key: '5GB', text: '介於1GB至5GB之間', value: '5GB' },
  { key: 'unlimmited', text: '無限制', value: 'unlimmited' }
]

const mailMethodOptions = [
  { text: '自行送交', value: 'selfDeliver' },
  { text: '掛號信', value: 'registeredMail' },
  { text: '平信', value: 'ordinaryMail' }
]

const payMethodOptions = [
  { text: '街口支付', value: 'jko' },
  { text: 'LinePay', value: 'linePay' },
  { text: '銀行轉帳', value: 'bankTransfer' }
]

export {
  genderOptions,
  boolOptions,
  androidSystemVersion,
  mobileOpitons,
  osOptions,
  cityOptions,
  jobOptions,
  networkAccessOptions,
  networkLimit,
  mailMethodOptions,
  payMethodOptions
}
