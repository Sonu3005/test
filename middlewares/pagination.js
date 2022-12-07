/**
 * name : pagination.js
 * author : Aman Gupta
 * Date : 22-Oct-2022
 * Description : Pagination
 */

module.exports = (req, res, next) => {
    req.pageNo = (req.query.page && Number(req.query.page) > 0) 
    ? Number(req.query.page) : 1;

    req.pageSize = (req.query.limit && Number(req.query.limit) > 0 && 
    Number(req.query.limit) <= 100) ? 
    Number(req.query.limit) : 0;

    req.searchText = (req.query.search && req.query.search != "") 
    ? decodeURI(req.query.search) : "";

    req.skipItem = (req.pageNo - 1) * req.pageSize;
    
    next();
    return;
}


