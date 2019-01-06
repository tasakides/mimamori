class Graph {
    constructor(div, graph_type) {
        this.div = div;
        this.type = graph_type;
        (async function (self) {
            let ids = await data.sessioncheck()
            self.draw_id(ids)
        })(this);
        setInterval(() => this.renew(), 1000)
    }

    //データを持ってくる
    async get(id) {
        let data = await $.get("/data/" + id);
        let return_data = {time: [], data: []}
        for (let k of data) {
            return_data.time.push(new Date(k.time))
            return_data.data.push(k[this.type])
        }
        return return_data
    }


    make_dataset(data) {
        let dataset = []
        for (let d of data) {
            dataset.push({
                type: 'line',
                x: d.time,
                xaxis: 'x',
                y: d.data
            })
        }
        return dataset
    }

    //グラフ書く
    async draw(data) {
        let dataset = this.make_dataset(data)

        let layout = {
            xaxis: {'domain': [0, 1]},
        };

        Plotly.newPlot(this.div, dataset, layout);
    }

    async draw_id(ids) {
        let data = []
        for (let id of ids) {
            data.push(await this.get(id))
        }
        await this.draw(data)

    }

    async renew() {
        let ids = await data.sessioncheck()

        let datas = []
        for (let id of ids) {
            datas.push(await this.get(id))
        }
        let dataset = this.make_dataset(datas)
        document.getElementById("graph1").data = dataset
        Plotly.redraw(this.div)
    }

}

