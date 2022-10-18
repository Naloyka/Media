export default class AddPost {
    constructor() {
        this.addPostText()
        this.addAudio()
        this.addVideo()
        this.geolocation = this.geolocation.bind(this)
        this.position = this.position.bind(this)
        this.longitude;
        this.latitude;
        this.addCoord = this.addCoord.bind(this)
        this.closeModal()
        this.load()
        this.valueCoord()
        this.coords = this.coords.bind(this)
        this.saveStorage = this.saveStorage.bind(this)
    }

    geolocation() {
        const modal = document.querySelector('.modal')
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((data) => {
                const { latitude, longitude } = data.coords
                this.position(latitude, longitude)
            }, (e) => {
                modal.classList.add("modal_active")
            })
        }
    }

    position(x, y) {
        this.longitude = y
        this.latitude = x
    }

    closeModal() {
        const modal = document.querySelector('.modal')
        const close = document.querySelector(".close")
        close.addEventListener("click", () => {
            modal.classList.remove("modal_active")
        })
    }

    valueCoord() {
        const adCoord = document.querySelector(".add-coord")

        const ok = document.querySelector(".ok")
        ok.addEventListener("click", (e) => {
            this.addCoord(adCoord.value)
        })

    }

    coords(x1, x2) {
        if (/^-?([0-8]?[0-9]|90)(\.[0-9]{1,10})$/.test(x1) && /^-?([0-8]?[0-9]|90)(\.[0-9]{1,10})$/.test(x2)) {
            return true
        } else return false
    }

    addCoord(val) {
        const err = document.querySelector(".err")
        const modal = document.querySelector('.modal')
        let text = '60.0538397, 30.4181857'
        let value = val

        if (value.includes(', ')) {

            let coordtext = value.split(', ')

            if (this.coords(coordtext[1], coordtext[0])) {
                this.longitude = coordtext[1];
                this.latitude = coordtext[0];
                modal.classList.remove("modal_active")
                return `[${this.longitude}, ${this.latitude}]`
            } else {
                err.textContent = "Заполненная форма не валидна"
                setInterval(() => {
                    err.textContent = ""
                }, 3000)
                throw new Error("Заполненная форма не валидна")
            }
        } else {
            err.textContent = "Заполненная форма не валидна"
            setInterval(() => {
                err.textContent = ""
            }, 3000)
        }

    }

    addPostText() {

        const post = document.querySelector(".post")
        const modal = document.querySelector('.modal')
        const send = document.querySelector('.send')
        let postText = document.querySelector(".post-text")
        send.addEventListener("click", (e) => {

            if (this.longitude && this.latitude) {
                post.insertAdjacentHTML('beforebegin', `<div class="post-content">
                    <p>${postText.value}</p><span class="geolocation">[${this.latitude}, ${this.longitude}]</span></div>`)
                postText.value = ''
                this.saveStorage()
            } else {
                modal.classList.add("modal_active")
            }

        })
    }

    addAudio() {
        const audioPlayer = document.querySelector(".audio")
        const recordAudio = document.querySelector(".record_audio");
        const post = document.querySelector(".post")
        const stop = document.querySelector(".stop-audio")
        this.geolocation()

        recordAudio.addEventListener("click", async () => {

            const stream1 = await navigator.mediaDevices.getUserMedia({
                audio: true,
            })
            const chunks = []
            const recorder1 = new MediaRecorder(stream1)
            recorder1.addEventListener("start", () => {
                recordAudio.style.display = "none"
                stop.style.display = 'block'
            })
            recorder1.addEventListener('dataavailable', (e) => {
                chunks.push(e.data)
            })
            let recordAudioActive = document.querySelector(".record_audio_active")
            recorder1.addEventListener("stop", () => {
                const blobs = new Blob(chunks)
                post.insertAdjacentHTML('beforebegin', ` <div class="post-content"><audio class="audio" src=${URL.createObjectURL(blobs)} 
                controls></audio><span class="geolocation">[${this.latitude}, ${this.longitude}]</span></div>`)
                this.saveStorage()

                // audioPlayer.src = URL.createObjectURL(blobs)
            })
            recorder1.start()
            stop.addEventListener('click', () => {
                recorder1.stop()
                stream1.getTracks().forEach(trackk => trackk.stop())
                recordAudio.style.display = "block"
                stop.style.display = 'none'
            })
        })
    }

    addVideo() {
        const record = document.querySelector(".record");
        const videoPlayer = document.querySelector(".video")
        const post = document.querySelector(".post")
        const stop = document.querySelector(".stop-video")
        this.geolocation()

        record.addEventListener("click", async () => {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: true,
                audio: true,
            })
            const chunk = []
            const recorder = new MediaRecorder(stream)
            recorder.addEventListener("start", () => {
                record.style.display = "none"
                stop.style.display = 'block'
            })
            recorder.addEventListener('dataavailable', (e) => {
                chunk.push(e.data)
            })
            recorder.addEventListener("stop", () => {
                const blob = new Blob(chunk)
                post.insertAdjacentHTML('beforebegin', ` <div class="post-content"><video class="video" src=${URL.createObjectURL(blob)} 
                controls></video><span class="geolocation">[${this.latitude}, ${this.longitude}]</span></div>`)
                this.saveStorage()
            })
            recorder.start()
            stop.addEventListener('click', () => {
                recorder.stop()
                stream.getTracks().forEach(trackk => trackk.stop())
                record.style.display = "block"
                stop.style.display = 'none'
            })

        })

    }

    saveStorage() {
        let postContent = [...document.querySelectorAll(".post-content")]

        let storage = {

        }

        let count = 0;

        postContent.forEach(item => {
            let text = item.querySelector("p")
            let video = item.querySelector("video")
            let audio = item.querySelector("audio")
            let geo = item.querySelector('.geolocation')

            if (text) {
                storage[`${count}` + 'text'] = [text.textContent, geo.textContent]
                count++
            }
            if (video) {
                storage[`${count}` + 'video'] = [video.getAttribute('src'), geo.textContent]
                count++
            }
            if (audio) {
                storage[`${count}` + 'audio'] = [audio.getAttribute('src'), geo.textContent]
                count++
            }

        })

        localStorage.setItem("save", JSON.stringify(storage))
        console.log(localStorage.getItem('save'))

        console.log(JSON.parse(localStorage.getItem('save')))
    }

    load() {
        window.addEventListener('load', () => {
            let data = JSON.parse(localStorage.getItem('save'))
            const post = document.querySelector(".post")
            console.log(data)

            for (let item in data) {
                if (item.includes('text')) {
                    let dataArr = data[item]
                    console.log(dataArr)
                    post.insertAdjacentHTML('beforebegin', `<div class="post-content">
                    <p>${dataArr[0]}</p><span class="geolocation">${dataArr[1]}</span></div>`)
                }

                if (item.includes('video')) {
                    let dataArr = data[item]
                    post.insertAdjacentHTML('beforebegin', `<div class="post-content"><video class="video" src=${dataArr[0]} 
                controls></video><span class="geolocation">${dataArr[1]}</span></div>`)
                }

                if (item.includes('audio')) {
                    let dataArr = data[item]
                    post.insertAdjacentHTML('beforebegin', ` <div class="post-content"><audio class="audio" src=${dataArr[0]} 
                controls></audio><span class="geolocation">${dataArr[1]}</span></div>`)
                }
            }
        })
    }
}

let post = new AddPost()
