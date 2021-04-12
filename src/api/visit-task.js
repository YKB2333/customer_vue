import axios from '@/libs/http'

// 今日任务列表
export const getToDayTasks = () => axios.get(`/customer/visitTask/getToDayTasks`)

// 待办任务列表
export const getWaitTasks = (data) => axios.post(`/customer/visitTask/getWaitTasks`, data)

// 历史任务列表
export const getHistoryTasks = (data) => axios.post(`/customer/visitTask/getHistoryTasks`, data)

// 获取任务详情
export const getVisitTaskDetail = (id) => axios.get(`/customer/visitTask/getOneVisitTask/${id}`)

// 取消任务
export const cancelVisitTask = (data) => axios.post(`/customer/visitTask/cancel`, data)

// 任务调整时间
export const adjustVisitTask = (data) => axios.post(`/customer/visitTask/adjust`, data)

// 到店打卡
export const clockIn = (data) => axios.post(`/customer/visitTask/clockIn`, data)

// 离店打卡
export const clockOut = (data) => axios.post(`/customer/visitTask/clockOut`, data)

// 保存陈列信息
export const saveDisPlayDetail = (data) => axios.post(`/customer/visitTask/saveDisPlayDetail`, data)

// 陈列照片上传
export const disPlayImageUpload = (data) => axios.post(`/customer/visitTask/disPlayImageUpload`, data)

// 提叫拜访总结
export const submitVisitTaskSummary = (data) => axios.post(`/customer/visitTask/submitVisitTaskSummary`, data)

// 保存竞品信息
export const saveTaskCompetitor = (data) => axios.post(`/customer/visitTask/saveTaskCompetitor`, data)

// 竞品信息-活动照片上传
export const taskCompetitorImageUpload = (data) => axios.post(`/customer/visitTask/taskCompetitorImageUpload`, data)

// 商品搜索
export const searchGoods = (data) => axios.post(`/customer/visitTask/getCategoryAndGoods`, data)

// 保存商品sku信息
export const saveTaskSku = (data) => axios.post(`/customer/visitTask/saveTaskSku`, data)

// 删除商品sku
export const delSkuByTaskId = (data) => axios.post(`/customer/visitTask/delSkuByTaskId`, data)

// 获取已完成商品
export const getSkusByTaskId = (data) => axios.post(`/customer/visitTask/getSkusByTaskId`, data)

// 获取任务单个商品
export const getSkuByTaskId = (data) => axios.post(`/customer/visitTask/getSkuByTaskId`, data)

