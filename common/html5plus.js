import Clipic from "clipic";
import { getHeadPortrait } from "@/api/user";

export function createFlie(path, data) {
  return new Promise((resolve) => {
    //这里封装了个是一个promise异步请求
    // plus.io.requestFileSystem是请求本地文件系统对象
    plus.io.requestFileSystem(
      plus.io.PUBLIC_DOCUMENTS, // 文件系统中的根目录下的DOCUMENTS目录
      (fs) => {
        // 创建或打开文件, fs.root是根目录操作对象,直接fs表示当前操作对象
        fs.root.getFile(
          path + ".json",
          {
            create: true, // 文件不存在则创建
          },
          (fileEntry) => {
            // 文件在手机中的路径
            // console.log(fileEntry.fullPath)
            fileEntry.createWriter((writer) => {
              // 写入文件成功完成的回调函数
              writer.onwrite = (e) => {
                console.log("写入本地文件成功");
                resolve("写入本地文件");
              };
              // 写入数据
              writer.write(JSON.stringify(data));
            });
          },
          (e) => {
            console.log("getFile failed: " + e.message);
          }
        );
      },
      (e) => {
        console.log(e.message);
      }
    );
  });
}
//查看我们新建的documents目录下的所有文件,或者删除指定文件
export function getFileList() {
  return new Promise((resolve) => {
    plus.io.requestFileSystem(
      plus.io.PUBLIC_DOWNLOADS,
      function (entry) {
        var directoryReader = entry.createReader(); //获取读取目录对象
        directoryReader.readEntries(
          function (entries) {
            resolve(entries);
          },
          function (err) {
            plus.nativeUI.toast(err.message);
          }
        );
      },
      function (err) {
        plus.nativeUI.toast(err.message);
      }
    );
  });
}
//查看目录下的某个指定文件
export function getFileData(path) {
  return new Promise((resolve) => {
    //文件读写是一个异步请求 用promise包起来方便使用时的async+await
    plus.io.requestFileSystem(
      plus.io.PUBLIC_DOCUMENTS,
      (fs) => {
        fs.root.getFile(
          path + ".json",
          {
            create: false,
          },
          (fileEntry) => {
            fileEntry.file((file) => {
              console.log("文件大小:" + file.size + "-- 文件名:" + file.name);
              //创建读取文件对象
              let fileReader = new plus.io.FileReader();
              //以文本格式读取文件数据内容
              fileReader.readAsText(file, "utf-8");
              //文件读取操作完成时的回调函数
              fileReader.onloadend = (evt) => {
                console.log(
                  JSON.parse(evt.target.result),
                  "JSON.parse(evt.target.result)"
                );
                resolve(JSON.parse(evt.target.result));
                // sURL = JSON.parse(evt.target.result).URL;
              };
            });
          },
          (e) => {
            console.log("getFile failed: " + e.message);
          }
        );
      },
      (e) => {
        console.log(e.message);
      }
    );
  });
}

export function uploadEvent(upload_url, params) {
  return new Promise((resolve) => {
    plus.nativeUI.actionSheet(
      {
        cancel: "Cancel",
        buttons: [{ title: "Photo upload" }, { title: "Album selection" }],
      },
      function (e) {
        //plus.nativeUI.toast(e.index)
        if (e.index == 0) resolve(0);
        if (e.index == 1) {
          plus.camera.getCamera(1).captureImage(function (p) {
            //上传图片
            //avatarUpload(plus.io.convertLocalFileSystemURL(p));
            changeToLocalUrl(p);
          });
        } else if (e.index == 2) {
          plus.gallery.pick(
            function (p) {
              //avatarUpload(p);
              changeToLocalUrl(p);
            },
            {
              filter: "image",
              multiple: false, //单选图片（true：多选图片）
            }
          );
        }
      }
    );

    function changeToLocalUrl(path) {
      plus.io.resolveLocalFileSystemURL(path, function (entry) {
        //plus.nativeUI.toast(entry.toLocalURL())
        const clipic = new Clipic();
        clipic.getImage({
          width: 250,
          height: 250,
          //ratio: 16 / 9,
          src: entry.toLocalURL(),
          buttonText: ["Cancel", "Reset", "Done"],
          name: "avatar.jpg",
          encode: "file", // 支持 base64、blob、file
          //type: 'png',
          // quality: '0.9', // 导出图片的质量
          onDone: function (e) {
            //plus.nativeUI.toast(e)
            //document.getElementById('previewImg').src = e
            //avatarUpload(e)
            startUpload(e);
          },
          onCancel: function () {
            plus.nativeUI.toast("取消裁剪");
            avatarUpload(path);
          },
        });
      });
    }

    function startUpload(file) {
      let data = { file: file, rid: params.rid.toString() };
      //plus.nativeUI.toast(JSON.stringify(data))
      getHeadPortrait(data).then((res) => {
        resolve(res.data);
      });
    }

    //多选图片
    function galleryImgs() {
      // 从相册中选择图片
      plus.gallery.pick(
        function (e) {
          for (var i in e.files) {
            console.log(e.files[i]); //选取的图片数组
          }
        },
        function (e) {
          plus.nativeUI.toast("取消选择图片");
        },
        {
          filter: "image",
          multiple: true,
        }
      );
    }
    /**
     * @description上传头像
     * @param avatar 图片路径
     * */
    function avatarUpload(avatar) {
      var task = getTask(upload_url, function (t, status) {
        //创建上传任务
        //plus.nativeUI.toast(status)
        //alert(JSON.stringify(t))
        if (status == 200) {
          //返回状态
          var data = JSON.parse(t.responseText || "{}");
          //plus.nativeUI.toast(data.message || '上传成功');
          resolve(data);
        } else {
          alert(JSON.stringify(t));
          //plus.nativeUI.toast("保存失败，请重试");
        }
      });
      //plus.nativeUI.toast(JSON.stringify(params))
      task.addData("rid", params.rid.toString()); //后台接口设定的参数
      task.setRequestHeader("user-token", localStorage.getItem("token")); //后台接口设定的参数
      task.addFile(avatar, { key: "file" }); //所上传文件
      task.start(); //开始上传任务
    }
    //创建上传任务
    function getTask(server, callback) {
      return plus.uploader.createUpload(
        server,
        {
          method: "POST",
          priority: 100,
        },
        callback
      );
    }
  });
}

export function getDeviceInfo() {
    let data = {
        uuid: '',
        imei: plus.device.imei,
        imsi: plus.device.imsi,
        model: plus.device.model,
        vendor: plus.device.vendor,
        screen:
          plus.screen.resolutionWidth * plus.screen.scale +
          " x " +
          plus.screen.resolutionHeight * plus.screen.scale,
        dpi: plus.screen.dpiX + " x " + plus.screen.dpiY,
        language: plus.os.language,
        version: plus.os.version,
      };
      return data
  
}
