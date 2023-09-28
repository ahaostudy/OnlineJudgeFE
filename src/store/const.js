import { defineStore } from 'pinia'
import { computed } from 'vue'

export const useConstStore = defineStore('const', () => {
    const CodeSuccess = { code: 1000, msg: "success" }
    const CodeInvalidParams = { code: 2001, msg: "请求参数错误" }
    const CodeUserExist = { code: 2002, msg: "用户名已存在" }
    const CodeUserNotExist = { code: 2003, msg: "用户不存在" }
    const CodeInvalidPassword = { code: 2004, msg: "用户名或密码错误" }
    const CodeNotMatchPassword = { code: 2005, msg: "两次密码不一致" }
    const CodeInvalidToken = { code: 2006, msg: "无效的Token" }
    const CodeNotLogin = { code: 2007, msg: "用户未登录" }
    const CodeInvalidCaptcha = { code: 2008, msg: "验证码错误" }
    const CodeRecordNotFound = { code: 2009, msg: "记录不存在" }
    const CodeSubmitNotFound = { code: 2010, msg: "提交不存在或已过期" }
    const CodeNotRegistred = { code: 2011, msg: "未报名比赛" }
    const CodeAlreadyRegistered = { code: 2012, msg: "用户已报名" }
    const CodeContestNotStarted = { code: 2013, msg: "比赛未开始" }
    const CodeContestHasStarted = { code: 2014, msg: "比赛已经开始" }
    const CodeContestNotExist = { code: 2015, msg: "比赛不存在" }
    const CodeContestNotOngoing = { code: 2016, msg: "比赛未开始或已结束" }
    const CodeForbidden = { code: 3001, msg: "权限不足" }
    const CodeServerBusy = { code: 4001, msg: "服务繁忙" }

    const Languages = ['C++', 'C', 'Python', 'Java', 'Golang']
    const LanguageSuffixs = ['cpp', 'c', 'python', 'java', 'go']

    const StatusAccepted = 10
    const StatusFinished = 11
    const StatusRunning = 12
    const StatusCompileError = 20
    const StatusRuntimeError = 21
    const StatusWrongAnswer = 22
    const StatusTimeLimitExceeded = 23
    const StatusMemoryLimitExceeded = 24
    const StatusOutputLimitExceeded = 25
    const StatusServerFailed = 30
    const StatusHide = 0

    const Status = new Array();
    Status[StatusAccepted] = { status: 'Accepted', type: 'success' }
    Status[StatusFinished] = { status: 'Finished', type: 'success' }
    Status[StatusRunning] = { status: 'Running', type: 'normal' }
    Status[StatusCompileError] = { status: 'Compile Error', type: 'error' }
    Status[StatusRuntimeError] = { status: 'Runtime Error', type: 'error' }
    Status[StatusWrongAnswer] = { status: 'Wrong Answer', type: 'error' }
    Status[StatusTimeLimitExceeded] = { status: 'Time Limit Exceeded', type: 'error' }
    Status[StatusMemoryLimitExceeded] = { status: 'Memory Limit Exceeded', type: 'error' }
    Status[StatusOutputLimitExceeded] = { status: 'Output Limit Exceeded', type: 'error' }
    Status[StatusServerFailed] = { status: 'Server Failed', type: 'error' }
    Status[StatusHide] = { status: '', type: 'normal' }

    const GetStatus = computed(() => (code) => {
        if (code in Status) return { status: Status[code].status, type: Status[code].type, code: code }
        return { status: 'Server Failed', type: 'error', code: code }
    })

    return {
        CodeSuccess,
        CodeInvalidParams,
        CodeUserExist,
        CodeUserNotExist,
        CodeInvalidPassword,
        CodeNotMatchPassword,
        CodeInvalidToken,
        CodeNotLogin,
        CodeInvalidCaptcha,
        CodeRecordNotFound,
        CodeSubmitNotFound,
        CodeNotRegistred,
        CodeAlreadyRegistered,
        CodeContestNotStarted,
        CodeContestHasStarted,
        CodeContestNotExist,
        CodeContestNotOngoing,
        CodeForbidden,
        CodeServerBusy,

        Languages,
        LanguageSuffixs,

        StatusAccepted,
        StatusFinished,
        StatusRunning,
        StatusCompileError,
        StatusRuntimeError,
        StatusWrongAnswer,
        StatusTimeLimitExceeded,
        StatusMemoryLimitExceeded,
        StatusOutputLimitExceeded,
        StatusServerFailed,
        StatusHide,
        Status,
        GetStatus
    }
})
