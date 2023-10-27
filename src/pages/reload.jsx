

import L from 'leaflet';

/*
L.TileLayer.WMS.prototype.createTile = function(coords, done) {
    var tile = document.createElement("img");

    L.DomEvent.on(tile, "error", L.Util.bind(function reloadImg(done, tile) {
        const url = new URL(tile.src);

        var nreload = Number(url.searchParams.get('pccosreload'))

        if (nreload < 5) {
            nreload = nreload + 1
            console.log('pccosreload ' + nreload);
            url.searchParams.set("nocache", Math.random() * 1000);
            url.searchParams.set("pccosreload", nreload);
            tile.src = url.toString();
        }
    }, this, done, tile));

    L.DomEvent.on(tile, "load", L.Util.bind(this._tileOnLoad, this, done, tile));
    L.DomEvent.on(tile, "error", L.Util.bind(this._tileOnError, this, done, tile));

    if (this.options.crossOrigin || this.options.crossOrigin === "") {
        tile.crossOrigin = this.options.crossOrigin === true ? "" : this.options.crossOrigin;
    }

    // for this new option we follow the documented behavior
    // more closely by only setting the property when string
    if (typeof this.options.referrerPolicy === "string") {
        tile.referrerPolicy = this.options.referrerPolicy;
    }

    // The alt attribute is set to the empty string,
    // allowing screen readers to ignore the decorative image tiles.
    // https://www.w3.org/WAI/tutorials/images/decorative/
    // https://www.w3.org/TR/html-aria/#el-img-empty-alt
    tile.alt = "";

    tile.src = this.getTileUrl(coords);

    return tile;
};
*/
document.addEventListener("DOMContentLoaded", ()=>{
    // Modif m.Foletto 10/05/2023 - Debouce call to WMS thredds
    window.pccos = {
        params: {
            wms: "",
        },
    };

function debounce(func, timeout=500) {
    let timer;
    return (...args)=>{
        clearTimeout(timer);
        timer = setTimeout(()=>{
            func.apply(this, args);
        }
        , timeout);
    }
    ;
}

L.TileLayer.include({
    _spc_oldUpdate: L.GridLayer.prototype._update,

    _spc_init: false,
    _spc_onZoom: false,

    _update: function() {
        // Init var
        if (this._spc_init === false) {
            this._spc_init = true;

            // Listener to know if user zoom
            this._map.addEventListener("zoomstart", ()=>{
                this._spc_onZoom = true;
            }
            );

            // Action when user finished to zoom
            this._spc_deboucedOnZoom = debounce(()=>{
                this._spc_onZoom = false;
                this._spc_oldUpdate();
                console.log('debounced')
            }
            , 1000);
            this._map.addEventListener("zoomend", this._spc_deboucedOnZoom);
        }

        // not WMS layer or not zooming action
        if (!this._url.includes(window.pccos.params.wms) || !this._spc_onZoom) {
            this._spc_oldUpdate();
            return;
        }
    },
});
});