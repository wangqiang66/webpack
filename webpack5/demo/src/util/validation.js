class Validation{
    constructor(rules={},messages={}){
        Object.assign(this,{
            rules,
            messages
        })
        this._init()
    }

    /**
     * 初始化方法
     */
    _init() {
        this._initMethods()
        this._initDefaults()
        this._initData()
    }

    _initData() {

    }

    _initDefaults() {
        this.defaults = {
            messages: {
              required: '这是必填字段。',    
              tel: '手机号码输入错误',
              telCode: '验证码输入错误',
              idCard: '请输入18位的有效身份证。',
              userName: '用户名只能包含字母、数字、_、-、/',
              password: '密码只能使用数字和字母，且必须同时包含数字和字母',
              verifyCode: '动态码输入错误，请重新输入',
              default: '输入错误',
              defError: '字段定义错误'
            }
          }
    }

    _initMethods() {
        const that = this
        that.methods = {
            required(val) {
                if (typeof val === 'number') {
                    val = val.toString()
                } else if (typeof val === 'boolean') {
                    return true
                }
                return val.length > 0
            },
            /**
             * 核对姓名是否符合规范
             */
            checkName(val) {
               if (val.match(/^[\u4e00-\u9fa5]{2,20}$/)) {
                   return true
               }
               return false
            },
            // 身份证号码
            idCard(value) {
                 //第一重校验，校验是否是18位且是17位数字加X或一个数字
                // var regId = new RegExp(/^\d{17}[\dX]$/, 'g');
                if (!value || !/(^\d{17}(\d|X|x)$)/.test(value)) {
                    return false
                }
                else {
                    ////第二重校验,出生日期校验
                    var birthday = value.replace(/^\d{6}(\d{4})(\d{2})(\d{2})\d{3}[\dX]$/, '$1/$2/$3');
                    if (!(new Date(birthday).getTime())) {
                        return false
                    }
                    else {
                        //第三重校验，权重校验
                        var weight = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2],
                        validate = ['1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2'],
                        totalWeight = 0;
                        value = value.toUpperCase();
                        var idCardWeight = value.replace(/^(\d{17})[\dX]/, '$1').split('').map(function (data, index) { return data * weight[index]; });
                        for (var i = 0; i < idCardWeight.length; i++) {
                            totalWeight += idCardWeight[i];
                        }
                        var validateCode = validate[totalWeight % 11];
                        if (value.substring(value.length - 1) != validateCode) {
                        return false
                        }
                        return true
                    }
                }
            },
            // 全数字
            allNum(val) {
                if (typeof val === 'number') {
                    return true
                } else if (!Number.isNaN(Number(val))) {
                    return true
                } else {
                    return false
                }
            },
            checkMoney(val) {
                console.log(val)
                if (Number.isNaN(Number(val))) {
                    return false
                } else if (Number(val)>10000 || Number(val)<= 0){
                    return false
                } else {
                    return true
                }
            },
            // 渠道名称
            checkChannel(val) {
                if (val.match(/^[a-zA-Z\u4e00-\u9fa5]{1,50}$/)) {
                    return true
                }
                return false
            },
            // 手机号
            checkTel(val) {
                if (typeof val === 'number') {
                    val = val.toString()
                }

                if (val.match(/^1[0123456789]\d{9}$/)) {
                    return true
                }
                return false
            }
        }
    }

    checkItem(rule, val) {
        
        if (!val) {
            return false
        }

        var type = rule.type

        switch(type) {
            case 'name':
               return this.methods.checkName(val)
               break;
            case 'idCard':
               return this.methods.idCard(val)
               break;
            case 'tel':
                return this.methods.checkTel(val)
                break;
            case 'allNum':
                return this.methods.allNum(val)
                break;
            case 'channelName':
                return this.methods.checkChannel(val)
                break;
            case 'money':
                return this.methods.checkMoney(val)
                break;
            default:
               return this.methods.required(val)
               break;
        }

    }

    checkForm(obj, callback) {
        var rules = this.rules
        var messages = this.messages
        var attrs = Object.keys(rules)
        // if (typeof list !== 'object' || list.length < 0) {
        //     return false
        // }
        // for (var item of list) {
        //     if (!this.checkItem(item.type,item.val)) {
        //         return false
        //     }
        // }

        // return true
        if (typeof obj !== 'object') {
            callback && callback(false,this.defaults.messages.defError)
            return false
        }

        for (var item of attrs) {
            if (obj[item] === '' || obj[item] === null || obj[item] === undefined) {
                callback && callback(false, messages[item].required || this.defaults.messages[item] || this.defaults.messages.default)
                return 
            }
            if (!this.checkItem(rules[item],obj[item])) {
                callback && callback(false, messages[item].error || this.defaults.messages[item] || this.defaults.messages.default,  messages[item].text || '')
                return
            }
        }

        callback && callback(true)
    }
}

export default Validation