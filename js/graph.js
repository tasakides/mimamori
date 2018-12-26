class Graph {
    constructor(div) {
        this.div = div
    }

    //データを持ってくる
    async get(id) {
        let data = await $.get("/data/" + id);
        let return_data = {time: [], temp: []}
        for (let k of data) {
            return_data.time.push(new Date(k.time))
            return_data.temp.push(k.temp)
        }
        return return_data
    }

    //グラフ書く
    async draw(data) {
        let dataset = []
        for (let d of data) {
            dataset.push({
                type: 'line',
                x: d.time,
                xaxis: 'x',
                y: d.temp
            })
        }

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

}


