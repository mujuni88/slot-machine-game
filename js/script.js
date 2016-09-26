(function () {

    /**************** Application Start ****************/
    var reelData = [
        {
            interval:200,
            numInterval:11,
            selector:'#reel1 .slm-reel-item',
            wrdSelector:'#noun'
        },
        {
            interval:250,
            numInterval:11,
            selector:'#reel2 .slm-reel-item',
            wrdSelector:'#verb'
        },
        {
            interval:300,
            numInterval:11,
            selector:'#reel3 .slm-reel-item',
            wrdSelector:'#adj'
        }
    ];
    
    var reels = reelData.map(function(data){
        return new Reel(data.interval, data.numInterval, data.selector, data.wrdSelector);
    });

    var app = new SlotMachine(reels),
        start = document.getElementById('start');

    start.addEventListener('click', function () {
        app.onLeverClick();
    });

    /**************** Reel Class ****************/
    function Reel(interval, numInterval, selector, wrdSelector) {
        this.interval = interval || 800;
        this.numInterval = numInterval || 6;
        this.selector = selector;
        this.intervalId = null;
        this.wrdSelector = wrdSelector;
    }

    Reel.prototype.rotateReelItems = function () {
        var self = this,
            reelItems = document.querySelectorAll(self.selector),
            temp = reelItems[0].outerHTML;

        reelItems[0].outerHTML = reelItems[4].outerHTML;
        reelItems[4].outerHTML = reelItems[3].outerHTML;
        reelItems[3].outerHTML = reelItems[2].outerHTML;
        reelItems[2].outerHTML = reelItems[1].outerHTML;
        reelItems[1].outerHTML = temp;
        
        document.querySelector(self.wrdSelector).innerHTML = reelItems[2].textContent;
    };


    Reel.prototype.animate = function () {
        var self = this;
        return new Promise(function (resolve) {
            var rand = Math.floor(Math.random() * 5),
                numInterval = rand + self.numInterval,
                data;

            if (self.intervalId) {
                clearInterval(self.intervalId);
            }

            self.intervalId = setInterval(function () {
                self.rotateReelItems();
                if (--numInterval === 0) {
                    clearInterval(self.intervalId);
                    data = document.querySelectorAll(self.selector)[2].textContent;
                    resolve({data:data, id:self.wrdSelector});
                }
            }, rand + self.interval);
        });
    };

    /**************** SlotMachine Class ****************/
    function SlotMachine(reels) {
        this.reels = reels;
    }

    SlotMachine.prototype.onLeverClick = function () {
        var self = this,
            promises = self.reels.map(function (reel) {
                return reel.animate();
            });

        document.querySelector('#noun').classList.remove('blink');
        document.querySelector('#verb').classList.remove('blink');
        document.querySelector('#adj').classList.remove('blink');
        document.querySelector('.slm-line-lbl').classList.remove('blink');

        Promise.all(promises).then(function (values) {
            self.displayResults(values);
        });
    };
    SlotMachine.prototype.displayResults = function(values){
        var resLbl = document.querySelector('.slm-line-lbl'),
            el;
        resLbl.classList.add('blink');
        values.forEach(function(d){
            el = document.querySelector(d.id);
            el.classList.add('blink');
            el.innerHTML = d.data;
        });
        
    }

})();