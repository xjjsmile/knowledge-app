<template>
  <div id="feedbackPage">

<div style="padding: 0 15px;">
    <textarea
      cols="30"
      v-model="content"
      rows="10"
      placeholder="请输入问题并留下联系方式，我们会尽快联系您"
      @input="question('text')"
    ></textarea>
    <!-- 字数限制 -->
    <div class="count">
      <span :class="{ active: textLength > textTotal }">{{ textLength }}</span>
      /{{ textTotal }}
    </div>
    <input type="text" v-model="contact" placeholder="您的手机号、QQ或邮箱（三选一）" @input="question('phone')" />
    <!-- 字数限制 -->
    <div class="count">
      <span :class="{ active: phoneLength > phoneTotal }">{{ phoneLength }}</span>
      /{{ phoneTotal }}
    </div>
    <upload :uploadData="uploadData"></upload>
</div>



    <div v-if="this.isIphx" style="height: 34px;"></div>

    <div class="bottomBox" :class="{iphx:this.isIphx}" v-if="submit">
      <van-button disabled type="danger" size="large" replace>提交</van-button>
    </div>

    <div class="bottomBox" :class="{iphx:this.isIphx}" v-else>
      <van-button type="danger" size="large" replace @click="submitFeedback">提交</van-button>
    </div>

    <EazyNav type="brand" :isShow="true"></EazyNav>
  </div>
</template>

<style scoped src="@/style/scss/pages/help/index.scss" lang="scss"></style>

<script>
import upload from "../../../components/upload";
// import easyNav from "./../../../components/easyNav";
import { USER_FEEDBACK_ADD } from "../../../apis/user.js";
import { COMMON_UPLOAD } from "../../../apis/public.js";
import { setTimeout } from "timers";
export default {
  components: {
    upload
    // easyNav
  },
  data() {
    return {
      textLength: 0,
      phoneLength: 0,
      textTotal: 500,
      phoneTotal: 50,
      // navData: {
      //   fold: false,
      //   home: true,
      //   homeLink: "/brand/index",
      //   search: false,
      //   // searchLink: "/search",
      //   personal: true,
      //   personalLink: "/personal/index",
      //   type: "order"
      // },
      submit: true,
      uploadData: {
        maxlength: 3
      },
      feedbackData: {},
      feedbackImgs: "",
      content: "",
      contact: "",
      url: ""
    };
  },
  mounted() {
    var input = $("input").val();
    // console.log(input.length);
  },
  methods: {
    change(_type) {
      var input = $("input")
        .val()
        .trim();
      var textarea = $("textarea")
        .val()
        .trim();
      var iphone = /^1[3|4|5|6|7|8|9][0-9]\d{8}$/;
      var qqNumber = /[1-9][0-9]{5,13}/;
      var email = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((.[a-zA-Z0-9_-]{2,3}){1,2})$/;
      // var uploadFile =$('.contetn.set').length;
      // 判断字数是否超出，限制字数
      if (_type == "text") this.textLength = textarea.length;
      if (_type == "phone") this.phoneLength = $("input").val().length;
      if (_type == "text" && this.textLength > this.textTotal) {
        this.content = this.content.trim().substring(0, this.textTotal);
        this.textLength = this.textTotal;
      }
      if (_type == "phone" && this.phoneLength > this.phoneTotal) {
        this.contact = this.contact.trim().substring(0, this.phoneTotal);
        this.phoneLength = this.phoneTotal;
      }

      if (
        (iphone.test(input) || qqNumber.test(input) || email.test(input)) &&
        $("textarea").val().length > 0 &&
        $("textarea").val().length <= this.textTotal &&
        $("input").val().length > 0 &&
        $("input").val().length <= this.phoneTotal
      ) {
        this.submit = false;
        // console.log(this.submit);
      } else {
        this.submit = true;
      }
    },
    question(_type) {
      this.change(_type);
    }, //获取上传图片路径
    async getImgUrl() {
      if ($(".flex-box").length > 1) {
        this.feedbackImgs =
          $(".content.set")
            .eq(0)
            .attr("data-src") +
          "||" +
          $(".content.set")
            .eq(1)
            .attr("data-src") +
          "||" +
          $(".content.set")
            .eq(2)
            .attr("data-src");
        this.feedbackImgs = this.feedbackImgs
          .split("||")
          .filter(item => item !== "undefined")
          .join("||");
        // console.log(this.feedbackImgs)

        var tStamp = this.$getTimeStamp();
        var data = {
          version: "1.0",
          timestamp: tStamp,
          file: this.feedbackImgs,
          opt_type: "feedback",
          file_type: "Base64",
          source: 1
        };

        data.sign = this.$getSign(data);
        let res = await COMMON_UPLOAD(data);
        if (res.hasOwnProperty("response_code")) {
          
          

          // console.log(res);
          var arr = [];
          for (let i = 0; i < res.response_data.length; i++) {
            arr.push(res.response_data[i].url);
          }
          this.url = arr.join("|");
          // console.log(this.url)

          // console.log(this.content,this.contact)
        } else {
          this.$toast(res.error_message);
        }
      }
      this.submitAll();
    },
    //提交反馈
    async submitFeedback() {
      this.getImgUrl();
    },
    async submitAll() {
      var tStamp = this.$getTimeStamp();
      this.content = $("textarea")
        .val()
        .trim();
      this.contact = $("input")
        .val()
        .trim();
      var data = {
        version: "1.0",
        timestamp: tStamp,
        url: this.url,
        content: this.content,
        contact: this.contact
      };

      data.sign = this.$getSign(data);
      let res1 = await USER_FEEDBACK_ADD(data);
      if (res1.hasOwnProperty("response_code")) {
        this.$toast("提交成功!");
        this.$router.push("/personal/help/index");
      } else {
        this.$toast(res1.error_message);
      }
    }
  }
};
</script>
