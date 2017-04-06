function classmatesComponentClass(){
    this.name="Classmates Selector";
    this.icon="components/componentIcons/classmates.png";
}

classmatesComponentClass.prototype=new Component();
classmatesComponentClass.prototype.constructor = classmatesComponentClass;




classmatesComponentClass.prototype.setBaseConfig=function setBaseConfig(){
    var self=this;
    self.info={};
    self.config={};
};


classmatesComponentClass.prototype.drawComponent=function drawComponent(){
    var self=this;
    
    var li=$(document.createElement("li")).attr("id","classmatesComponent").attr("data", JSON.stringify(self.info)).attr("config", JSON.stringify(self.config)).addClass("component");
    // Minimal values for widget size
    $(li).attr("data-min-sizex","2").attr("data-min-sizey","1").attr("data-max-sizex","4").attr("data-max-sizey","3");
    
    console.log(self.info);
    
    // Açò caldrà restaurar-ho quan tingam la vista feta
    
    
    self.info={"alu01":true,"alu02":true, "alu0":true};
    console.log(self.config);
    
    // Calculate children in classroom
    var numalum=0;
    var rows, cols;
    var grid_template_rows="";
    
    for (var i in self.info) if (self.info[i]) numalum++;
    // And now rows and columns
    if (numalum<10) {
        cols=3;
        classMatesContainer="classMatesContainer3cols";  }
    else {
        cols=4;
        classMatesContainer="classMatesContainer4cols"; }
    
    rows=Math.floor(numalum/cols)+1;
    var row_percent=100/(rows+1);
    for (i=0; i<rows; i++){ grid_template_rows+=row_percent+"% "; }
    
    //console.log("cols="+cols);
    //console.log("rows="+rows);
    //console.log(grid_template_rows);
    
    
    if (JSON.stringify(self.info)==="{}"){
        $(li).html("").addClass("emptySchool");
    } else {
        var container=$(document.createElement("div")).addClass("classmatesContainer").addClass(classMatesContainer).css("grid-template-rows", grid_template_rows);
        for (i in self.info){
            //console.log(self.info[i]);
            
            var aluname="Sense Nom";
            var aluimg="components/classmates/img/ninya.jpeg";
            
            console.log(typeof(self.config[i]));
            if (typeof(self.config[i])==="object"){                
                if(self.config[i].name) aluname=self.config[i].name;
                if(self.config[i].img) aluimg="file://"+self.configDir+"/components/classmates/"+self.config[i].img;
            }
            
            
            var aluicon=$(document.createElement("div")).addClass("aluicon").css("background-image", "url("+aluimg+")");
            $(aluicon).attr("title", aluname);
            /*var aluiconimg=$(document.createElement("div")).addClass("aluiconimg").css("background-image", aluimg);
            var aluiconname=$(document.createElement("div")).addClass("aluiconname").html(aluname);*/
            //$(aluicon).append(aluiconimg, aluiconname);
            console.log(aluname+" "+aluimg);
            
            $(container).append(aluicon);
            
            
        }
        var titlediv=$(document.createElement("div")).html(i18n.gettext("classmates.frontend.tile")).css("height","15%").addClass("textfluid").attr("fontzoom", "0.8");
        $(li).append(titlediv, container);
        
        
    }
        
    
    
    
         
    return li;
};


classmatesComponentClass.prototype.getASDialog=function getASDialog(){
    var self=this;
                  
    var ret={"message": i18n.gettext("data.component.title")};
 
    var input=$(document.createElement("div")).html("hola");
    //$(input).append(leftCol, centerCol, rightCol);

    ret.input=$(input).prop("outerHTML");
    
    
    ret.bindEvents=function(){
        
    };
    
    ret.processDialog=function(){
    
    };
        
    return ret;
        
    
};


classmatesComponentClass.prototype.SelectImageForAlu=function SelectImageForAlu(){
    var self=this;
    
    $(".aluImg").off("click");
    $(".aluImg").on("click", function(){
        var alu=$(this).attr("id").replace("img", "");
        var fileselector=$(document.createElement("input")).attr("id", "fileSelector").attr("type", "file").css("display", "none");
        $(classmatesConfig).append(fileselector);
        $(fileselector).on("change", function(){
            
            try{
                // Check mimetype for image
                var newImage=this.value;
                // https://www.npmjs.com/package/file-type
                const readChunk = require('read-chunk');
                const fileType = require('file-type');
                const buffer = readChunk.sync(newImage, 0, 4100);
                
                // Check if exists classmates subdir
                var fs=require("fs");
                var classmatesdir=self.configDir+"/components/classmates/";
                if (!fs.existsSync(classmatesdir)) {
                    fs.mkdirSync(classmatesdir); }
    
                //console.log(fileType(buffer));
                    
                if (fileType(buffer).mime.split("/")[0]=="image"){
                    var fs=require('fs');
                       
                    var filename=newImage.split("/").pop();
                     var oldImage=self.configDir+"/components/classmates/"+filename;
                        
                    console.log(oldImage+ " - "+newImage);
                        
                    var stream=fs.createReadStream(newImage).pipe(fs.createWriteStream(oldImage));
                        
                    stream.on('close', function(){
                        // Wait for stream has been copied
                        $("#img"+alu).attr("src", "file://"+oldImage);

                        self.config[alu].img=filename;
                        //console.log(self.config);
                    }); 
                }
            } catch (err){
                    console.log(err);
            }
            });
            $(fileselector).click();
        });
};
        


classmatesComponentClass.prototype.getConfigDialog=function getConfigDialog(){
    var self=this;
 
    var ret={"message": i18n.gettext("classmates.component.options")};
    
    
    var input=$(document.createElement("div")).attr("id", "classmatesConfig");
    //for (i in self.monthOptions){
    console.log(self.config);
    for (var alu in self.config){        
        //var aluItem=$(document.createElement("div")).attr("id", alu).addClass("col-md-3 aluItem");
        var aluItem=$(document.createElement("div")).attr("id", alu).addClass("aluItem");
        // image file
        var aluImgFile="";
        if(self.config[alu].img!="")
        {
            aluImgFile="file://"+self.configDir+"/components/classmates/"+self.config[alu].img;}
        else 
            aluImgFile="components/classmates/img/ninyo.jpeg";
        
        
        var aluImg=$(document.createElement("img")).attr("src", aluImgFile).addClass("aluImg").attr("id", "img"+alu);
        //var aluName=$(document.createElement("div")).html(self.config[alu].name).addClass("aluName textfluid").attr("fontzoom",1.5);
        var aluName=$(document.createElement("input")).attr("type", "text").attr("value", self.config[alu].name).addClass("aluName textfluid").attr("fontzoom",1.5);
        //var configRow=$(document.createElement("div"));
        $(aluItem).append(aluImg, aluName);
        $(input).append(aluItem);
        
    }
    
    // Adding "new" button
    var newItem=$(document.createElement("div")).attr("id", "newAlu").addClass("col-md-3 aluItem newAluButton");
    $(input).append(newItem);
        
    
    
    ret.input=$(input).prop("outerHTML");
    
    
    ret.bindEvents=function(){
        self.SelectImageForAlu();
        
        $("#newAlu").on("click", function(){
            // Look for last id added:
            var lastindex=0;
            var newItemId="alu"+lastindex;
            while($("#"+newItemId).length!==0){
                lastindex++;
                newItemId="alu"+lastindex;
            }
            
            
            //var aluItem=$(document.createElement("div")).attr("id", newItemId).addClass("col-md-3 aluItem");
            var aluItem=$(document.createElement("div")).attr("id", newItemId).addClass("aluItem");
            // image file
            var aluImgFile="components/classmates/img/ninyo.jpeg";
            var aluImg=$(document.createElement("img")).attr("src", aluImgFile).addClass("aluImg").attr("id", "imgalu"+newItemId);
            var aluName=$(document.createElement("input")).attr("type", "text").attr("value", "Nou").addClass("aluName textfluid").attr("fontzoom",1.5);
            console.log(aluItem);
            $(aluItem).append(aluImg, aluName);
            $(aluItem).insertBefore("#newAlu");
            
            // Rebind some events like click on image
            self.SelectImageForAlu(); 
            
            resizeFonts();
            
            }); // End click on newAlu
        
    $("input").blur();
    
    }; // End binding events callback function
    
    ret.processDialog=function(){
        
        var componentconfig={};
        //{\"alu01\":{\"img\":\"\",\"name\":\"alup1\"},\"alu02\":{\"img\":\"\",\"name\":\"alup2\"}}
        $("div.aluItem").each(function( ) {
            var id=$(this).attr("id");
            var img=$(this).find("img").attr("src");
            var name=$(this).find("input").val();
            
            if (id!=="newAlu") { // Ignore Button
                var filename="";
                if (img.substr(0,7)==="file://") filename=img.split("/").pop();
                componentconfig[id]={"img": filename, "name": name};
            }
            
        });
        console.log(componentconfig);
        self.config=componentconfig;
        $("#classmatesComponent").attr("config", JSON.stringify(componentconfig));
        
        //$("#classmatesComponent").attr("config", JSON.stringify(self.config));
        $("#btSave").click();
        
        
        
    };
    
        
    return ret;
};


