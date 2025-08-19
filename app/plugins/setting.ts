// @ts-ignore
import moment from "moment";

export default defineNuxtPlugin((nuxtApp: any) => {
  nuxtApp.provide("formateDate", (value: string | null, format: string) => {
    if (value) {
      return moment(new Date(String(value))).format(format);
      // return moment(String(value)).format(format);
    } else {
      const a = new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
        .toISOString()
        .substr(0, 10);

      return moment(String(a)).format(format);
    }
  });
  nuxtApp.provide("stringToDate", (value: string, format: string) => {
    var momentDate = moment(value, format);
    return momentDate.toDate();
  });
  nuxtApp.provide(
    "getDateList",
    (start: string, end: string, format: string) => {
      var dates = [];
      var sDate = moment(start, format);
      var currentDate = sDate.toDate();
      var eDate = moment(end, format);
      var endDate = eDate.toDate();
      while (currentDate <= endDate) {
        var final =
          currentDate.getFullYear() +
          "-" +
          (currentDate.getMonth() + 1 < 10 ? "0" : "") +
          (currentDate.getMonth() + 1) +
          "-" +
          (currentDate.getDate() < 10 ? "0" : "") +
          currentDate.getDate();
        dates.push(final);
        currentDate.setDate(currentDate.getDate() + 1);
      }
      return dates;
    }
  );

  nuxtApp.provide("getIdFormDate", () => {
    var date = new Date();
    var id =
      date.getFullYear().toString() +
      (date.getMonth() + 1).toString().padStart(2, "0") +
      date.getDate().toString().padStart(2, "0") +
      date.getHours().toString().padStart(2, "0") +
      date.getMinutes().toString().padStart(2, "0") +
      date.getSeconds().toString().padStart(2, "0") +
      date.getMilliseconds().toString();
    return id;
  });
  nuxtApp.provide("formateAmount", (value: string) => {
    value = value + ",";
    value = value.replace(/,/g, "");
    let val = (Number(value) / 1).toFixed(0).replace(",", ".");
    return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  });

  nuxtApp.provide("IsImageFile", (filename: string) => {
    // get file extension
    const img = ["png", "jpg", "jpeg"];
    const word = ["doc"];
    const pdf = ["pdf"];
    var value = "I";

    const extension: any = filename.split(".").pop();
    if (img.includes(extension)) {
      value = "I";
    } else if (word.includes(extension)) {
      value = "W";
    } else if (pdf.includes(extension)) {
      value = "P";
    }
    return value;
  });

  nuxtApp.provide("profilePath", (filename: String|null,) => {
    const r = '/api/image/profile/'+filename;
    return r;
  });

  nuxtApp.provide("isMobile", (vuetify: any, value: Array<string>) => {
    const r = value.includes(vuetify.display.name.toUpperCase());
    return r;
  });

  nuxtApp.provide("getImgUrl", (picture: string) => {
    return nuxtApp.$env.picPath + "/" + picture;
  });
  nuxtApp.provide("getFilePath", (path: string) => {
    return nuxtApp.$env.filePath + path;
  });
  nuxtApp.provide("convertFileSize", (size: number) => {
    var i = size == 0 ? 0 : Math.floor(Math.log(size) / Math.log(1024));
    return (
      +(size / Math.pow(1024, i)).toFixed(2) * 1 +
      " " +
      ["B", "kB", "MB", "GB", "TB"][i]
    );
  });
});
