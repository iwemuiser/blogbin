import { Request, Response, ResponseOptions, RequestMethod } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';

export class MockXHRBackend {
    constructor() {
    }

    createConnection(request: Request) {
        var response = new Observable((responseObserver: Observer<Response>) => {
            var responseData;
            var responseOptions;
            switch (request.method) {
                case RequestMethod.Get:
                    if (request.url.indexOf('blogitems?type=') >= 0 || request.url === 'blogitems') {
                        var medium;
                        if (request.url.indexOf('?') >= 0) {
                            medium = request.url.split('=')[1];
                            if (medium === 'undefined') medium = '';
                        }
                        var blogItems;
                        if (medium) {
                            blogItems = this._blogItems.filter(blogItem => blogItem.medium === medium);
                        } else {
                            blogItems = this._blogItems;
                        }
                        responseOptions = new ResponseOptions({
                            body: { blogItems: JSON.parse(JSON.stringify(blogItems)) },
                            status: 200
                        });
                    } else {
                        var id = parseInt(request.url.split('/')[1]);
                        blogItems = this._blogItems.filter(blogItem => blogItem.id === id);
                        responseOptions = new ResponseOptions({
                            body: JSON.parse(JSON.stringify(blogItems[0])),
                            status: 200
                        });
                    }
                    break;
                case RequestMethod.Post:
                    var blogItem = JSON.parse(request.text().toString());
                    blogItem.id = this._getNewId();
                    this._blogItems.push(blogItem);
                    responseOptions = new ResponseOptions({ status: 201 });
                    break;
                case RequestMethod.Delete:
                    var id = parseInt(request.url.split('/')[1]);
                    this._deleteMediaItem(id);
                    responseOptions = new ResponseOptions({ status: 200 });
            }

            var responseObject = new Response(responseOptions);
            responseObserver.next(responseObject);
            responseObserver.complete();
            return () => { };
        });
        return { response };
    }

    _deleteMediaItem(id) {
        var blogItem = this._blogItems.find(blogItem => blogItem.id === id);
        var index = this._blogItems.indexOf(blogItem);
        if (index >= 0) {
            this._blogItems.splice(index, 1);
        }
    }

    _getNewId() {
        if (this._blogItems.length > 0) {
            return Math.max.apply(Math, this._blogItems.map(blogItem => blogItem.id)) + 1;
        }
    }

    _blogItems = [
        {
            id: 1,
            name: "Eastward",
            type: "Single journey",
            language: ["English", "Dutch"],
            vehicles: ["own car"],
            start_timestamp: 1451602800000,
            end_timestamp: 1483225200000,
            start_year: 2016,
            end_year: 2017,
            countries: ["Turkey", "Iran", "Mongolia", "Russia"],
            cities: ["Teheran", "Mashhad", "Ulanbaatar", "Vladivostok"],
            watchedOn: 1294166565384,
            isFavorite: false
        }, {
            id: 2,
            name: "Travel4ever",
            type: "Multi journey",
            language: ["Czech"],
            vehicles: ["train", "bus", "hitchhike", "rental"],
            start_timestamp: 1293836400000,
            end_timestamp: null,
            start_year: 2011, // should system time
            end_year: null, // should system time
            countries: ["Netherlands", "Denmark", "Germany", "Belgium"], //should be country codes
            cities: ["Amsterdam", "Kopenhagen", "Berlin", "Brussels"], //should city codes
            watchedOn: 1294166565384,
            isFavorite: false
        }, {
            id: 3,
            name: "",
            type: "Multi journey",
            language: ["Czech"],
            vehicles: ["train", "bus", "hitchhike", "rental"],
            start_timestamp: 1293836400000,
            end_timestamp: null,
            start_year: 2011, // should system time
            end_year: null, // should system time
            countries: ["Netherlands", "Denmark", "Germany", "Belgium"], //should be country codes
            cities: ["Amsterdam", "Kopenhagen", "Berlin", "Brussels"], //should city codes
            watchedOn: 1294166565384,
            isFavorite: false
        }
    ];
}