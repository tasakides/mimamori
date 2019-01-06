class Data {
    constructor() {
        this.diff_temp = {}

        this.template_for_temp = `
            <div class="col-lg-3 col-xs-6">
                <!-- small box -->
                <div class="small-box bg-orange">
                    <div class="inner">
                        <h3>{{temp_temp}}</h3>

                        <p>{{temp_place}}</p>
                    </div>
                    <div class="icon">
                        <i class="ion ion-thermometer"></i>
                    </div>
                    <!--<a href="#" class="small-box-footer">More info <i class="fa fa-arrow-circle-right"></i></a>-->
                </div>
            </div>`;
        this.template_for_mess = `
            <div class="col-lg-12 col-xs-12">
                <!-- small box -->
                <div class="info-box">
                    <span class="info-box-icon bg-red"><i class="ion ion-alert-circled"></i></span>
                    <div class="info-box-content">
                        <span class="info-box-text"><h4>{{mess_mess}}</h4></span>
                    </div>
            <!-- /.info-box-content -->
                </div>
            </div>`;
        this.template_for_mess2 = `
            <div class="col-lg-12 col-xs-12">
                <!-- small box -->
                <div class="info-box">
                    <span class="info-box-icon bg-aqua"><i class="ion ion-alert-circled"></i></span>
                    <div class="info-box-content">
                        <span class="info-box-text"><h4>{{mess_mess}}</h4></span>
                    </div>
            <!-- /.info-box-content -->
                </div>
            </div>`;
        let self = this;
        //温度計算
        setInterval(() => self.calc_difftemp(), 1000)

        setInterval(() => self.get_temp(), 1000)
    }


    async get_temp() {
        let t = ""
        let s = ""
        let ids = await this.sessioncheck()
        let d = 0
        let message = ""
        for (let id of ids) {
            let {data} = await this.get(id)
            if (data == null || data.length == 0)
                break
            let last_temp = data[data.length - 1]
            let message = last_temp + "度"
            t += this.template_for_temp
                .replace("{{temp_temp}}", message)
                .replace("{{temp_place}}", id)
            if (last_temp > 30)
                d = 1
        }
        $("#temp_table")[0].innerHTML = t
        if (d == 1) {
            message = "高温の部屋があります。熱中症に気をつけてください。"
            $("#mess_table>div")[0].innerHTML = this.template_for_mess
                .replace("{{mess_mess}}", message)
        } else
            $("#mess_table>div")[0].innerHTML = ""

    }

    async calc_difftemp() {
        let data = await this.get_all()
        let message = ""
        let dd = 0
        this.diff_temp = {}

        for (let id1 in data) {
            this.diff_temp[id1] = {}
            for (let id2 in data) {
                let d = this.diff_temp[id1][id2] = this.abs(data[id1].data[data[id1].data.length - 1] - data[id2].data[data[id2].data.length - 1])
                if ((d > 10 && data[id1].data[data[id1].data.length - 1] < 10) || (d > 10 && data[id2].data[data[id2].data.length - 1] < 10))
                    dd = 1
            }
        }
        if (dd == 1) {
            message = "温度差が激しい場所があります。寒くなっているのでヒートショックに気をつけてください。"
            $("#mess_table>div")[1].innerHTML = this.template_for_mess2
                .replace("{{mess_mess}}", message)
        } else
            $("#mess_table>div")[1].innerHTML = ""

        // console.log(his.diff_temp)
    }

    async sessioncheck() {
        let data = await (await fetch("/sessionok", {
            method: "GET", // *GET, POST, PUT, DELETE, etc.
            // mode: "cors", // no-cors, cors, *same-origin
            cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
            credentials: "same-origin", // include, same-origin, *omit
            headers: {
                //"Content-Type": "application/json; charset=utf-8",
                "Content-Type": "application/x-www-form-urlencoded",
            },
            redirect: "follow", // manual, *follow, error
            referrer: "no-referrer", // no-referrer, *client
        })).text()
        // console.log(data)
        if (data == "Reject") {
            window.location.href = "/"
            return null
        }
        let id = JSON.parse(data)
        return id;
    }

    async get(id) {
        let data = await $.get("/data/" + id);
        let return_data = {time: [], data: []}
        for (let k of data) {
            return_data.time.push(new Date(k.time))
            return_data.data.push(k["temp"] - 0)
        }
        return return_data
    }

    //idを入力すると全部のデータをとってくる関数
    async get_all() {
        let ids = await this.sessioncheck()
        let d = {}
        for (let id of ids) {
            let {time, data} = await this.get(id)
            if (data == null || data.length == 0 || time == null || time.length == 0)
                break
            d[id] = {time, data}
        }
        return d
    }

    abs(val) {
        return val < 0 ? -val : val;
    };

    calc_temp(id1, id2, data) {
        return abs(data[id1].data[data[id1].data.length - 1] - data[id2].data[data[id2].data.length - 1])
    }


}