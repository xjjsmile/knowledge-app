<template>
  <div id="helpPage" :style="{'background-color':bgcolor}">
    <div class="active-bg">
      <div class="bg-piture" :style="{backgroundImage:'url('+helpinitData.activity_cover+')'}"></div>
      <div class="activeRules" @click="activeRules">
        <div class="activeText">活动规则</div>
      </div>
    </div>
    <div class="helpBoss" v-if="supportGetO" :style="{'color':color}">
      你已成功助力
      <span :style="{'color':lightcolor}">{{ helpinitData.launch_nickname }}</span>，恭喜获得优惠劵！
    </div>
    <div class="helpBoss" v-if="supportGet" :style="{'color':color}">
      你已为
      <span :style="{'color':lightcolor}">{{ helpinitData.launch_nickname }}</span>助力，不能重复助力哦！
    </div>
    <div class="helpBoss" v-if="supportGetThree" :style="{'color':color}">
      你已经助力过了
      <span :style="{'color':lightcolor}">{{ helpinitData.launch_nickname }}</span>
    </div>
    <div class="couponImg">
      <div
        class="bookImg"
        v-lazy:background-image="helpinitData.support_award_pic"
        v-if="supportSuccess"
      ></div>
    </div>
    <div class="fieldBox" v-if="supportNew">
      <van-field
        :class="{ phone: isPhone }"
        v-model="phone"
        clearable
        placeholder="请输入您的手机号"
        error-message
        type="tel"
        maxlength="11"
        @input="checkSubmit ('phone')"
      />
      <van-field
        v-model="code"
        clearable
        maxlength="4"
        placeholder="请输入短信验证码"
        @input="checkSubmit ('')"
        class="codestyle"
      >
        <template v-if="codeData.disabled">
          <van-button slot="button" size="small" round disabled type="danger">{{ codeData.timeMsg }}</van-button>
        </template>
        <template v-else>
          <van-button
            slot="button"
            size="small"
            round
            type="danger"
            @click="getCode"
          >{{ codeData.timeMsg }}</van-button>
        </template>
      </van-field>
    </div>
    <div class="newPrompt" v-if="this.supportNewPre" :style="{'color':lightcolor}">
      <svg class="icon" aria-hidden="true">
        <use xlink:href="#icon-diandiandian" />
      </svg>
      {{ this.oldUserPrompt }}
      <svg class="icon" aria-hidden="true">
        <use xlink:href="#icon-diandiandian-you" />
      </svg>
    </div>
    <div class="activeMore">
      <div class="moreText" v-if="this.initButton" @click="supportCheck">
        帮好友助力，我也领5元
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-myactive_jiantou" />
        </svg>
      </div>
      <div class="moreText" v-if="this.supportNewButton" @click="supportNewCheck">
        帮好友助力，我也领5元
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-myactive_jiantou" />
        </svg>
      </div>
      <router-link
        :to="{name: 'assistactive', query: {activity_id: this.activity_id,source:1}}"
        v-if="this.supportOld"
      >
        <div class="moreText">
          我也要领
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-myactive_jiantou" />
          </svg>
        </div>
      </router-link>
    </div>
    <router-link
      :to="{name: 'assistactive', query: {activity_id: this.activity_id,source:1}}"
      v-if="this.initButton"
    >
      <div class="myText" :style="{'color':lightcolor}">我也要领</div>
    </router-link>
    <div class="rules" id="rules">
      <div class="rules-tit" :style="{'color':color}">
        <div class="line"></div>
        <div class="rulesTitle">活动规则</div>
        <div class="line"></div>
      </div>
      <div class="rulesCount" :style="{'color':color}" v-html="changeHtml(helpinitData.rules)"></div>
    </div>
    <div class="HuoBaApp" @click="HuoBaApp">
      <div class="svg">
        <div class="bookImg" v-lazy:background-image="helpinitData.brand_pic"></div>
      </div>
      <div class="Text">
        <div class="top">火把知识</div>
        <div class="bottom">让知识照亮未来!</div>
      </div>
      <div class="button">立即打开</div>
    </div>
    <EazyNav type="brand" :isShow="false"></EazyNav>
  </div>
</template>

<style src="@/style/scss/pages/assist/help.scss" scoped lang="scss"></style>

<style lang="scss" scoped>
#helpPage {
  .van-field__clear {
    color: red;
  }
  .van-field__control {
    color: #fff;
  }
}
</style>
<script>
import {
  ASSISTANCE_INVITEDETAIL,
  ASSISTANCE_SUPPORTCHECK
} from "../../apis/assist";
import {
  REG,
  SMS,
  PASSPORT_CHECKPHONE,
  LOGIN_BIND_PARTERNER
} from "../../apis/passport.js";
export default {
  data() {
    return {
      phone: "",
      isPhone: true,
      supportNew: false,
      supportOld: false,
      supportSuccess: true,
      initButton: true,
      supportGet: false,
      supportNewPre: false,
      supportNewButton: false,
      supportGetThree: false,
      supportGetO: false,
      launch_id: 0,
      code: "",
      bgcolor: "",
      color: "",
      lightcolor: "",
      oldUserPrompt: "",
      helpinitData: {
        rules: ""
      },
      activity_id: 0,
      supportCheckData: {},
      codeData: {
        disabled: true,
        timeMsg: "获取验证码",
        time: 60
      },
      submitData: {
        disabled: true
      },
      checked: true
    };
  },
  mounted() {
    this.launch_id = this.$route.query.launch_id;
    this.helpGetData();
  },
  methods: {
    activeRules() {
      document.querySelector("#rules").scrollIntoView(true);
    },
    // 格式校验
    checkSubmit(type) {
      var regPhone = /^1[3|4|5|6|7|8|9][0-9]\d{8}$/;
      if (type === "phone") {
        if (regPhone.test(this.phone)) {
          this.codeData.disabled = false;
        } else {
          this.codeData.disabled = true;
        }
      }
      if (
        regPhone.test(this.phone) &&
        this.code.length === 4 &&
        this.checked == true
      ) {
        this.submitData.disabled = false;
      } else {
        this.submitData.disabled = true;
      }
    },
    // 获取验证码
    async sms() {
      var tStamp = this.$getTimeStamp();
      let data = {
        timestamp: tStamp,
        mobile: this.phone,
        version: "1.0"
      };
      data.sign = this.$getSign(data);
      let res = await SMS(data);
      console.log(res);
    },
    getCode() {
      this.$countDown(this.codeData);
      this.sms();
    },
    // 获取助力页初始化基本信息
    async helpGetData() {
      var tStamp = this.$getTimeStamp();
      var data = {
        //获取微信信息
        launch_id: this.launch_id,
        version: "1.0",
        timestamp: tStamp
      };
      data.sign = this.$getSign(data);
      let res = await ASSISTANCE_INVITEDETAIL(data);
      if (res.hasOwnProperty("response_code")) {
        this.helpinitData = res.response_data;
        this.activity_id = res.response_data.activity_id;
        this.bgcolor = this.helpinitData.background;
        this.color = this.helpinitData.textcolor;
        this.lightcolor = this.helpinitData.lightcolor;
        if (this.helpinitData.user_type == 0) {
        } else if (this.helpinitData.user_type == 1) {
          this.$router.push({
            name: "assistactive",
            query: { activity_id: this.activity_id }
          });
        } else if (this.helpinitData.user_type == 2) {
          this.supportNew = false;
          this.initButton = false;
          this.supportNewButton = false;
          this.supportNewPre = false;
          this.supportSuccess = false;
          this.supportGetO = false;
          this.supportGet = true;
          this.supportOld = true;
          this.supportGetThree = false;
        } else if (this.helpinitData.user_type == 3) {
          this.supportNew = false;
          this.initButton = false;
          this.supportNewButton = false;
          this.supportNewPre = false;
          this.supportGetO = true;
          this.supportSuccess = true;
          this.supportGet = false;
          this.supportOld = true;
          this.supportGetThree = false;
        } else if (this.helpinitData.user_type == 4) {
          var proPer = "只有新用户可以帮好友助力哦";
          this.oldUserPrompt = proPer;
          this.supportNew = false;
          this.supportGet = false;
          this.supportGetThree = false;
          this.supportNewPre = true;
          this.supportOld = true;
          this.supportGetO = false;
          this.supportSuccess = false;
          this.supportNewButton = false;
          this.initButton = false;
          this.$toast(proPer);
        }
        this.pageShareInfo();
      } else {
        this.$toast(res.error_message);
      }
    },
    //页面分享信息获取方法
    pageShareInfo() {
      if (this.isWxLogin)
        this.$getWxShareData(
          "assist/index",
          JSON.stringify({
            launch_id: this.launch_id,
            activity_id: this.helpinitData.activity_id
          })
        );
    },
    //验证用户为新用户还是老用户
    async supportCheck() {
      if (
        localStorage.getItem("unionid") == "undefined" ||
        localStorage.getItem("unionid") == "null" ||
        localStorage.getItem("unionid") == undefined ||
        localStorage.getItem("unionid") == null ||
        localStorage.getItem("unionid") == ""
      ) {
        sessionStorage.setItem("gotoLogin", "no");
        sessionStorage.setItem("isWxLogin", "no");

        if (
          window.navigator.userAgent.toLowerCase().match(/MicroMessenger/i) ==
          "micromessenger"
        ) {
          sessionStorage.setItem("isWxLogin", "yes");
          if (
            localStorage.getItem("openid") == "undefined" ||
            localStorage.getItem("openid") == undefined ||
            localStorage.getItem("openid") == "null" ||
            localStorage.getItem("openid") == null ||
            localStorage.getItem("nickname") == "null" ||
            localStorage.getItem("nickname") == null ||
            localStorage.getItem("unionid") == "null" ||
            localStorage.getItem("unionid") == null ||
            localStorage.getItem("headimg") == "null" ||
            localStorage.getItem("headimg") == null ||
            this.$route.name == "pay" ||
            this.$route.name == "payaccount" ||
            this.$route.name == "account"
          ) {
            this.$getWxCode();
            if (this.wxCodeStr == "") {
              var this_count = Number(localStorage.getItem("get_count"));
              if (this_count < 2) {
                this_count++;
                localStorage.setItem("get_count", this_count);
                this.$wxLogin();
              } else {
                localStorage.setItem("get_count", 0);
              }
            }
            if (this.wxCodeStr.length > 6) {
              let url =
                window.location.protocol +
                "//" +
                window.location.hostname +
                "/callback/weixin/Userinfo?code=" +
                this.wxCodeStr;

              var self = this;
              axios
                .get(url)
                .then(function(response) {
                  console.log(666, response);
                  if (
                    response.data.hasOwnProperty("code") &&
                    response.data.code == "1000"
                  ) {
                    console.log(response.data.msg);
                  } else {
                    localStorage.setItem("openid", response.data.openid);
                    localStorage.setItem("nickname", response.data.nickname);
                    localStorage.setItem("unionid", response.data.unionid);
                    localStorage.setItem("headimg", response.data.headimgurl);
                    self.wxCodeStr = "";
                    window.location.href =
                      window.location.protocol +
                      "//" +
                      window.location.hostname +
                      "/#" +
                      window.location.href.split("#")[1];
                  }
                })
                .catch(function(error) {
                  self.fetchError = error;
                  console.log("error:", error);
                });
            } else {
              //this.$toast("未获取到code");
            }
          }
          console.log(
            "openid:",
            localStorage.getItem("openid"),
            "unionid:",
            localStorage.getItem("unionid"),
            "nickname:",
            localStorage.getItem("nickname")
          );
        }
        if (
          localStorage.getItem("unionid") != "undefined" ||
          localStorage.getItem("unionid") != "null" ||
          localStorage.getItem("unionid") != undefined ||
          localStorage.getItem("unionid") != null ||
          localStorage.getItem("unionid") != ""
        ) {
          this.clickButtonBack();
        }
      } else {
        this.clickButtonBack();
      }
    },
    async clickButtonBack() {
      var tStamp = this.$getTimeStamp();
      var data = {
        launch_id: this.launch_id,
        unionid: localStorage.getItem("unionid"),
        version: "1.0",
        timestamp: tStamp
      };
      data.sign = this.$getSign(data);
      let res = await ASSISTANCE_SUPPORTCHECK(data);
      if (res.hasOwnProperty("response_code")) {
        if (res.response_data.state == "suc") {
          this.supportNew = true;
          this.supportNewButton = true;
          this.supportGet = false;
          this.supportGetThree = false;
          this.supportGetO = false;
          this.supportOld = false;
          this.supportSuccess = false;
          this.supportNewPre = false;
          this.initButton = false;
        } else {
          this.oldUserPrompt = res.error_message;
          this.supportNew = false;
          this.supportGet = false;
          this.supportGetThree = false;
          this.supportNewPre = true;
          this.supportOld = true;
          this.supportGetO = false;
          this.supportSuccess = false;
          this.supportNewButton = false;
          this.initButton = false;
          this.$toast(res.error_message);
        }
      } else {
        this.oldUserPrompt = res.error_message;
        this.supportNew = false;
        this.supportGet = false;
        this.supportGetThree = false;
        this.supportNewPre = true;
        this.supportOld = true;
        this.supportSuccess = false;
        this.supportNewButton = false;
        this.supportGetO = false;
        this.initButton = false;
        this.$toast(res.error_message);
      }
    },
    async supportNewCheck() {
      var tStamp = this.$getTimeStamp();
      var data = {
        launch_id: this.launch_id,
        activity_id: this.helpinitData.activity_id,
        type: 2,
        mobile: this.phone,
        auth_code: this.code,
        outer_id: localStorage.getItem("unionid"),
        outer_name: localStorage.getItem("nickname"),
        header_pic: localStorage.getItem("headimg"),
        openid: localStorage.getItem("openid"),
        source_url: localStorage.getItem("defaultLink"),
        version: "1.0",
        timestamp: tStamp
      };
      data.sign = this.$getSign(data);
      let res = await LOGIN_BIND_PARTERNER(data);
      if (res.hasOwnProperty("response_code")) {
        if (res.response_data.user_id) {
          this.supportNew = false;
          this.supportGet = false;
          this.supportGetO = true;
          this.supportGetThree = false;
          this.supportNewPre = false;
          this.supportOld = true;
          this.supportSuccess = true;
          this.supportNewButton = false;
          this.initButton = false;
        } else {
          this.$toast(res.error_message);
        }
      } else {
        this.$toast(res.error_message);
      }
    },
    changeHtml(content) {
      return content.replace(/\n/g, "<br>");
    },
    HuoBaApp() {
      window.location.href =
        "https://a.app.qq.com/o/simple.jsp?pkgname=com.huoba.Huoba";
    }
  }
};
</script>
