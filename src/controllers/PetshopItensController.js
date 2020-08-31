const Item = require ("../models/Item")
const { index } = require("./ItemController")

module.exports={
    
    async index(req,res)
    {
        let id=req.body.id
        let items
        let categories=req.body.activeCategory
        if (categories !== "Todas categorias")
        {
            items=await Item.find({$and:[{"category":categories},{"petshop":id}]});
        }
        else{
            items=await Item.find({"petshop":id});
        }
        if(!items)
        {
            return res.json(({"error":'Erro na busca',"status":"400"}))
        }
        return res.json(items)
    },
}