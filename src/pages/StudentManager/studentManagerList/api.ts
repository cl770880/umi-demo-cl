import { request } from '../../../hub';
import { GRAPH_TYPE_ENUM } from '../AIKnowledgeGraph/type';

const protocol = (typeof window === 'object' && window?.location?.protocol) || 'https:';

const URLS = {
  // 1.获取课堂下的学生列表
  getStuManageList: `${protocol}//www.icourse163.org/mm-classroom/web/j/mocTermClassroomRpcBean.simpleClassStuStatistics.rpc`,
  // 2.获取课堂管理下的学生分组列表
  getGroupInfo: `${protocol}//www.icourse163.org/mm-classroom/web/j/groupRpcBean.listGroupBaseInfo.rpc`,
  // 3。新建小组
  createGroup: `${protocol}//www.icourse163.org/mm-classroom/web/j/groupRpcBean.createGroup.rp`,
  // 4.清空小组
  cleanAllGroups: `${protocol}//www.icourse163.org/mm-classroom/web/j/groupRpcBean.cleanAllGroups.rpc`,
  // 5.学生分组
  fullGroup: `${protocol}//www.icourse163.org/mm-classroom/web/j/groupRpcBean.fullGroup.rpc`,
  // 6.导出学生列表
  asyncDownLoadClassroomStudStus: `${protocol}//www.icourse163.org/mm-classroom/web/j/asyncExportExcelDataBean.downLoadClassroomStudStus.rpc`,
  // 7.查询导出学生列表进度
  getThreadStatusByThreadId: `${protocol}//www.icourse163.org/mm-school/web/j/asyncExportExcelDataBean.getThreadStatusByThreadId.rpc`,
  // 8.将学生踢出课堂
  deleteStudentFromClassroom: `${protocol}//www.icourse163.org/mm-classroom/web/j/mocTermClassroomRpcBean.deleteStudentFromClassroom.rpc`,
  // 9.移动小组成员
  moveGroupMember: `${protocol}//www.icourse163.org/mm-classroom/web/j/groupRpcBean.moveGroupMember.rpc`,
  // 10.解散小组
  disbandGroup: `${protocol}//www.icourse163.org/mm-classroom/web/j/groupRpcBean.disbandGroup.rpc`,
}

// 1.获取课堂下的学生列表
export async function $getStuManageList(data:{
  classroomId: number,
  pageIndex: number,
  pageSize: number,
  keyword?: string,
  groupId?: number | null,
}){
  return request(URLS.getStuManageList,{
    method: 'POST',
    data,
  })
}
// 2.获取课堂管理下的学生分组列表
export async function $getGroupInfo(data:{
  classroomId: number,
}){
  return request(URLS.getGroupInfo,{
    method: 'POST',
    data,
  })
}
// 3.新建小组
export async function $createGroup(data:{
  classroomId: number,
  groupName: string,
}){
  return request(URLS.createGroup,{
    method: 'POST',
    data,
  })
}
// 4.清空小组
export async function $cleanAllGroups(data:{
  classroomId: number,
}){
  return request(URLS.cleanAllGroups,{
    method: 'POST',
    data,
  })
}
// 5.学生分组
export async function $fullGroup(data:{
  classroomId: number,
  groupMemberNumber: number,
}){
  return request(URLS.fullGroup,{
    method: 'POST',
    data,
  })
}
// 6.导出学生列表
export async function $asyncDownLoadClassroomStudStus(data:{
  classroomId: number,
  isSpoc: boolean,
  groupId?: number | null,
}){
  return request (URLS.asyncDownLoadClassroomStudStus,{
    method: 'POST',
    data,
  })
}
// 7.查询导出学生列表进度
export async function $getThreadStatusByThreadId(data:{
  threadId: string,
}){
  return request(URLS.getThreadStatusByThreadId,{
    method: 'POST',
    data,
  })
}
// 8.将学生踢出课堂
export async function $deleteStudentFromClassroom(data:{
  classroomId: number,
  studentMemberId: number | string,
}){
  return request(URLS.deleteStudentFromClassroom,{
    method: 'POST',
    data,
  })
}
// 9.移动小组成员
export async function $moveGroupMember(data:{
  classroomId: number,
  memberIds: number[],
  fromGroupId: number | string,
  toGroupId: number | string,
}){
  return request(URLS.moveGroupMember,{
    method: 'POST',
    data,
  })
}
// 10.解散小组
export async function $disbandGroup(data:{
  groupId: number | string,
}){
  return request(URLS.disbandGroup,{
    method: 'POST',
    data,
  })
}

