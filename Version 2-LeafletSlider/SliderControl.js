
L.Control.SliderControl = L.Control.extend({
    options: {
        position: 'topright',
        layers: null,
        timeAttribute: 'date_mise_en_service',
        isEpoch: false,     
        startTimeIdx: 0,    
        timeStrLength: 19,  
        maxValue: -1,
        minValue: 0,
        showAllOnStart: false,
        markers: null,
        range: false,
        follow: false,
        sameDate: false,
        alwaysShowDate : false,
        rezoom: null
    },


    
    initialize: function (options) {
        L.Util.setOptions(this, options);
        this._layer = this.options.layer;

    },

    extractTimestamp: function(time, options) {
        if (options.isEpoch) {
            time = (new Date(parseInt(time))).toString(); 
        }
        return time.substr(options.startTimeIdx, options.startTimeIdx + options.timeStrLength);
    },

    setPosition: function (position) {
        var map = this._map;

        if (map) {
            map.removeControl(this);
        }

        this.options.position = position;

        if (map) {
            map.addControl(this);
        }
        this.startSlider();
        return this;
    },

    onAdd: function (map) {
        this.options.map = map;

        
        var sliderContainer = L.DomUtil.create('div', 'slider', this._container);
        $(sliderContainer).append('<div id="leaflet-slider" style="width:200px"><div class="ui-slider-handle"></div><div id="slider-timestamp" style="width:200px; margin-top:13px; background-color:#FFFFFF; text-align:center; border-radius:5px;"></div></div>');
        
        $(sliderContainer).mousedown(function () {
            map.dragging.disable();
        });
        $(document).mouseup(function () {
            map.dragging.enable();
            
            if (options.range || !options.alwaysShowDate) {
                $('#slider-timestamp').html('');
            }
        });

        var options = this.options;
        this.options.markers = [];

        
        if (this._layer) {
            var index_temp = 0;
            this._layer.eachLayer(function (layer) {
                options.markers[index_temp] = layer;
                ++index_temp;
            });
            options.maxValue = index_temp - 1;
            this.options = options;
        } else {
            console.log("Erreur");
        }
        return sliderContainer;
    },

    onRemove: function (map) {
        
        for (i = this.options.minValue; i <= this.options.maxValue; i++) {
            map.removeLayer(this.options.markers[i]);
        }
        $('#leaflet-slider').remove();

        
        $(document).off("mouseup");
        $(".slider").off("mousedown");
    },

    startSlider: function () {
        _options = this.options;
        _extractTimestamp = this.extractTimestamp
        var index_start = _options.minValue;
        if(_options.showAllOnStart){
            index_start = _options.maxValue;
            if(_options.range) _options.values = [_options.minValue,_options.maxValue];
            else _options.value = _options.maxValue;
        }
        $("#leaflet-slider").slider({
            range: _options.range,
            value: _options.value,
            values: _options.values,
            min: _options.minValue,
            max: _options.maxValue,
            sameDate: _options.sameDate,
            step: 1,
            slide: function (e, ui) {
                var map = _options.map;
                var fg = L.featureGroup();
                if(!!_options.markers[ui.value]) {
                    
                    if(_options.markers[ui.value].feature !== undefined) {
                        if(_options.markers[ui.value].feature.properties[_options.timeAttribute]){
                            if(_options.markers[ui.value]) $('#slider-timestamp').html(
                                _extractTimestamp(_options.markers[ui.value].feature.properties[_options.timeAttribute], _options));
                        }else {
                            console.error("Time property "+ _options.timeAttribute +" not found in data");
                        }
                    }else {
                        
                        if(_options.markers [ui.value].options[_options.timeAttribute]){
                            if(_options.markers[ui.value]) $('#slider-timestamp').html(
                                _extractTimestamp(_options.markers[ui.value].options[_options.timeAttribute], _options));
                        }else {
                            console.error("Time property "+ _options.timeAttribute +" not found in data");
                        }
                    }

                    var i;
                    
                    for (i = _options.minValue; i <= _options.maxValue; i++) {
                        if(_options.markers[i]) map.removeLayer(_options.markers[i]);
                    }
                    if(_options.range){
                        
                        for (i = ui.values[0]; i <= ui.values[1]; i++){
                           if(_options.markers[i]) {
                               map.addLayer(_options.markers[i]);
                               fg.addLayer(_options.markers[i]);
                           }
                        }
                    }else if(_options.follow){
                        for (i = ui.value - _options.follow + 1; i <= ui.value ; i++) {
                            if(_options.markers[i]) {
                                map.addLayer(_options.markers[i]);
                                fg.addLayer(_options.markers[i]);
                            }
                        }
                    }else if(_options.sameDate){
                        var currentTime;
                        if (_options.markers[ui.value].feature !== undefined) {
                            currentTime = _options.markers[ui.value].feature.properties.time;
                        } else {
                            currentTime = _options.markers[ui.value].options.time;
                        }
                        for (i = _options.minValue; i <= _options.maxValue; i++) {
                            if(_options.markers[i].options.time == currentTime) map.addLayer(_options.markers[i]);
                        }
                    }else{
                        for (i = _options.minValue; i <= ui.value ; i++) {
                            if(_options.markers[i]) {
                                map.addLayer(_options.markers[i]);
                                fg.addLayer(_options.markers[i]);
                            }
                        }
                    }
                };
                if(_options.rezoom) {
                    map.fitBounds(fg.getBounds(), {
                        maxZoom: _options.rezoom
                    });
                }
            }
        });
        if (!_options.range && _options.alwaysShowDate) {
            $('#slider-timestamp').html(_extractTimeStamp(_options.markers[index_start].feature.properties[_options.timeAttribute], _options));
        }
        for (i = _options.minValue; i <= index_start; i++) {
            _options.map.addLayer(_options.markers[i]);
        }
    }
});

L.control.sliderControl = function (options) {
    return new L.Control.SliderControl(options);
};
