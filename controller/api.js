var async = require("async");
const Researchinfo = require("../model/Reserachinfo");
const Interest = require("../model/Interest");
const Paper = require("../model/Researchpaper");
const Table = require("../model/table");
const UserID = require("../model/userid");
const Department= require('../model/department');

const Singup = require("../model/singup");
const SerpApi = require("google-search-results-nodejs");
const router = require("../router");
var url = 0;

// var firstname = "";
// var secondname = "";
var departmentname = "";
var scholarurlname = "";
var srmidname = "";
var emailname = "";

var post = "";
var googleurl = "";

const search = new SerpApi.GoogleSearch(
  "ab1e180ec0a12feafffa41b431c3088ef3e771dc5bb2febbd3070aa1a287df78"
);

const callback = async function (data) {
  try {
    const obj = data["cited_by"];
    const author = data["author"];
    const name = author.name;
    const affiliation = author.affiliations;
    const picurl = author.thumbnail;
    const intrest = author.interests;
    const coauthor = data["co_authors"];
    const paper = data["articles"];
    const tables = data["cited_by"];
    const citationscount = tables.table[0].citations.all;
    const h_index = tables.table[1].h_index.all;
    const i10_index = tables.table[2].i10_index.all;
    const graph = tables.graph;

    departmentname = departmentname.trim();
    departmentname = departmentname.toUpperCase();
    post = post.trim();
    post = post.toUpperCase();

    let mydepartment=await Department.findOne({department:departmentname});

    if(!mydepartment){
       await Department.create({
         department:departmentname,
         paper:paper.length
       })

    }
    else{

         mydepartment.paper=mydepartment.paper+paper.length;
         mydepartment.save();
    }
   
    

    const singupaccount = await Singup.create({
      
      department: departmentname,
      scholarurl: scholarurlname,
      email: emailname,
      
    });

    // ,async function (singerr, singup) {

    await Researchinfo.create(
      {
        name: name,
        affliation: affiliation,
        profilepic: picurl,
        department: departmentname,
        post: post,
        scholarurl: googleurl,
        totalpaper: paper.length,
      },
      async function (err, profile) {
        if (err) {
          console.log(err);
        } else {
          async.each(intrest, function (inte) {
            const inter = inte.title;
            let int = inter.toUpperCase();
            profile.interest.push(int);

            Interest.findOne({ tittle: int }, async function (erri, getit) {
              if (!getit) {
                Interest.create(
                  {
                    tittle: int,
                  },
                  async function (err3, interestcreat) {
                    await interestcreat.user.push(profile);
                    await interestcreat.save();
                  }
                );
              } else {
                await getit.user.push(profile);
                await getit.save();
              }
            });
          });
        }

        const promises = await paper.map(function (paper) {
          Paper.create(
            {
              tittle: paper.title,
              link: paper.link,
              author: paper.authors,
              publication: paper.publication,
              publishyear: paper.year,
              cited: paper.cited_by.value,
            },
            async function (err, paperc) {
              if (err) {
                console.log(err + " eror");
              } else {
                paperc.user = profile;
                paperc.save();
              }
            }
          );
        });
        await Promise.all(promises);

        Table.create(
          {
            citations: citationscount,
            h_index: h_index,
            i10_index: i10_index,
          },
          function (errtable, graphtable) {
            if (errtable) {
            } else {
              for (let i = 0; i < graph.length; i++) {
                graphtable.graph.push(graph[i]);
              }

              graphtable.author = profile;

              profile.table = graphtable;
              async.each(coauthor, function (data) {
                profile.coauthor.push(data);
              });
            }
            graphtable.save();

            singupaccount.info = profile;
            profile.singup = singupaccount;
            profile.save();
            singupaccount.save();

          }
        );
      }
    );

    // });
  } catch (e) {console.log(e);}
};

// Show result as JSON

module.exports.save = async function (req, res) {
  try {
   
    const str = req.body.url;
    var start = 0;
    var end = 0;
    var a = 0;

    let index = str.indexOf("user=");
    start = index + 5;
    end = start;
    while (end != str.length && str.charAt(end) !== "&") {
      end = end + 1;
    }

    url = str.slice(start, end);

    const params = {
      engine: "google_scholar_author",
      author_id: url,
      num: "100",
    };

    
   
    let department = req.body.department;
    let scholarurl = req.body.url;
    let srmid = req.body.smrid;
    let email = req.body.email;
  
    let postrank = req.body.post;

    if (
    
      !(department &&
      scholarurl &&
      srmid &&
      email &&
     
      postrank)
    ) {
      return res.json(400, {
        message: "Incomplete Information",
      });
    }

    let present = await Singup.findOne({ email: email });
    if (present) {
      return res.json(200, {
        message: "Login Please",
      });
    }
   
    departmentname = department;
    scholarurlname = scholarurl;
    srmidname = srmidname;
    emailname = email;
    post = postrank;
    googleurl = scholarurl;

    UserID.create({ id: url }, function (err, userid) {});

    search.json(params, callback);
    return res.json(200, {
      message: "Success",
    });
  } catch (e) {
    console.log(e);
    return res.json(200, {
      message: "Invalid",
    });
  }
};
