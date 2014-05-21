#!/usr/bin/env python
# coding: utf-8 
# @Date    : 2014-04-27 10:47:55
# @Author  : jeremy	

import  tornado.web
import  tornado.ioloop
import  tornado.httpserver
import  tornado.options
import  os
import  sys
import  MySQLdb
from tornado.escape import json_encode
from tornado.options import define,options
define("port",default=8888,help="run on the given port",type=int)
#define("mysql_host",default="127.0.0.1:3306",help="databse host")
#define("mysql_user",default="root",help="database user name")
#define("mysql_password",default="385546117",help="database user password")

db = MySQLdb.connect("localhost","root","","meta_data",charset="utf8")
cursor = db.cursor()
reload(sys)
sys.setdefaultencoding('utf-8')

def md5(str):
    import hashlib
    m = hashlib.md5()   
    m.update(str)
    return m.hexdigest()

class Application(tornado.web.Application):
    def __init__(self):
        handlers = [
            (r"/", MainHandler),
            (r"/admin", AdminHandler),
            (r"/upload", UploadHandler),
            (r"/add", AddHandler),
            (r"/addcat", AddcatHandler),
            (r"/edit", EditHandler),
            (r"/search", SearchHandler),
            (r"/favor", FavorHandler),
            (r"/follow", FollowHandler),
        ]
        settings = dict(
            temlplate_path = os.path.join(os.path.dirname(__file__),"templates"),
            static_path = os.path.join(os.path.dirname(__file__),"static"),
            debug = True,
        )
        tornado.web.Application.__init__(self, handlers, **settings)

class MainHandler(tornado.web.RequestHandler):
    def get(self):
        #pass
        self.render("index.html")

class FollowHandler(tornado.web.RequestHandler):
    def get(self):
        cursor.execute("SELECT * FROM project ORDER BY rand() limit 0,30")
        result = cursor.fetchmany(30)
        if not result==():         
            final = ()
            for b in result:   
                cursor.execute("SELECT * FROM project_category WHERE project_id =%d" %b[0])
                temp = cursor.fetchall()
                category=()
                for a in temp :
                    cursor.execute("SELECT * FROM category WHERE category_id=%d"%a[1])
                    temp2 = cursor.fetchall()
                    for c in temp2:
                        category += (c[1], )
                final += ((b+(category,)),)
            
            project=[]
            for k in final :
                project.append ( {
                    'id':k[0],
                    'author':k[1],
                    'title':k[2],
                    'grade':k[3],
                    'summary':k[4],
                    'favor':k[6],
                    'score':k[5],
                    'teacher':k[7],
                    'date':k[8],
                    'category':k[9],
                    })
            data={'project':project}
            print final[0][9]
            self.write(json_encode(data))
                            

class AdminHandler(tornado.web.RequestHandler):
    def get(self):
        cursor.execute("SELECT * FROM category")
        category = cursor.fetchall()
        cursor.execute("SELECT * FROM project " )
        result = cursor.fetchall()
        self.render("2.html",category=category,data=result)
class UploadHandler(tornado.web.RequestHandler):
    def post(self):
        title = self.get_argument('project')
        pictures = self.request.files['upload']
        count = 0
        for picture in pictures:
            picName = title
            outputFile = open("E://1/static/images/project/" + md5(picName)+'-'+str(count)+'.jpg','wb')
            outputFile.write(picture['body'])
            self.write(picName)
            count +=1
class AddHandler(tornado.web.RequestHandler):
    def post(self):
        title = self.get_argument('project')
        author = self.get_argument('author')
        grade = self.get_argument('grade')
        summary = self.get_argument('summary')
        score = self.get_argument('score')
        categories = self.get_arguments('category')
        teacher = self.get_argument('teacher')
        adddate = self.get_argument('date')
        cursor.execute("INSERT INTO project (title,author,grade,summary,score,teacher,date)\
                        VALUES ('%s','%s','%d','%s','%d','%s','%s')"\
                        % (title,author,int(grade),summary,int(score),teacher,adddate)) 
        db.commit()
        cursor.execute("SELECT * FROM project WHERE title = '%s'" %title)
        result = cursor.fetchall()
        project_id = result[0][0]
        for category_id in categories:
            cursor.execute("INSERT INTO project_category values ('%s','%s')"%(project_id, category_id))
            print 1
            db.commit()
        pictures = self.request.files['upload']
        count = 0
        for picture in pictures:
            picName = title
            outputFile = open("D://1/static/images/project/" + md5(picName)+'-'+str(count)+'.jpg','wb')
            outputFile.write(picture['body'])
            self.write(picName)
            count +=1
        self.write("ok")
class AddcatHandler(tornado.web.RequestHandler):
    def post(self):
        category = self.get_argument('newcat')
        cursor.execute("INSERT INTO category (category) VALUES ('%s')" % category)
        db.commit()
        self.write("ok")

class SearchHandler(tornado.web.RequestHandler):
    def get(self):
        search = self.get_argument('search')
        fuc = int(self.get_argument('fuc'))
        result = ()
        if fuc == 0:
            cursor.execute("SELECT * FROM project WHERE grade = %d ORDER BY favor DESC" % int(search))
            result = cursor.fetchall()
        if fuc == 2:
            cursor.execute("SELECT * FROM project WHERE score >= %d ORDER BY favor DESC" % int(search)) 
            result = cursor.fetchall()
        if fuc == 1:
            cursor.execute("SELECT * FROM category WHERE category like '%%%s%%'  "%  search)
            result = cursor.fetchall()
            if not result==():
                #category_id = result[0][0]
                #cursor.execute("SELECT * FROM project_category WHERE category_id = %d " % category_id)
                #project_id = cursor.fetchall()
                #result=()
                #for c in project_id:
                      #cursor.execute("SELECT * FROM project WHERE project_id = %d " % c[0] )
                      #result += cursor.fetchall()   
                cursor.execute("SELECT project.project_id,author,title,grade,summary,score,favor,teacher,date\
                    FROM project_category, project, category \
                    WHERE category.category_id = project_category.category_id \
                    AND project.project_id = project_category.project_id \
                    ANd category LIKE '%%%s%%' \
                    ORDER BY favor DESC " % search)
                result = cursor.fetchall()
            else: 
                if result ==():
                    cursor.execute("SELECT * FROM project WHERE teacher like '%%%s%%' ORDER BY favor DESC" % search) 
                    result = cursor.fetchall()       
                if result ==():
                    cursor.execute("SELECT * FROM project WHERE summary like '%%%s%%' ORDER BY favor DESC" % search)
                    result = cursor.fetchall()
                if result ==():
                    cursor.execute("SELECT * FROM project WHERE author like '%%%s%%' ORDER BY favor DESC" % search)
                    result = cursor.fetchall()
                if result ==():
                    cursor.execute("SELECT * FROM project WHERE title like '%%%s%%' ORDER BY favor DESC" % search)
                    result = cursor.fetchall()
        if not result==():         
            final = ()
            for b in result:   
                cursor.execute("SELECT * FROM project_category WHERE project_id =%d" %b[0])
                temp = cursor.fetchall()
                category=()
                for a in temp :
                    cursor.execute("select * FROM category WHERE category_id=%d"%a[1])
                    temp2 = cursor.fetchall()
                    for c in temp2:
                        category += (c[1], )
                final += ((b+(category,)),)
                
            project=[]
            for k in final :
                project.append ( {
                    'id':k[0],
                    'author':k[1],
                    'title':k[2],
                    'grade':k[3],
                    'summary':k[4],
                    'favor':k[6],
                    'score':k[5],
                    'category':k[9],
                    'teacher':k[7],
                    'date':k[8]
                    })
            data={'project':project}
            self.write(json_encode(data))
            

class EditHandler(tornado.web.RequestHandler):
    def get(self):
        fuc = self.get_argument("fuc")
        id = self.get_argument("id")
        #分类标签 编辑
        if fuc ==1:
            content = self.get_argument("content")
            cursor.execute("UPDATE  SET category = %s WHERE category_id = %d " %(content, int(id)))
            db.commit()
        #内容     编辑
        elif fuc == 2:
            title = self.get_argument('project')
            author = self.get_argument('author')
            grade = self.get_argument('grade')
            summary = self.get_argument('summary')
            score = self.get_argument('score')
            cursor.execute("UPDATE project SET title='%s',author='%s',grade='%d',summary='%s',score='%d'\
                            WHERE project_id =%d"\
                            % (title,author,int(grade),summary,int(score),int(id))) 
            db.commit()
        #删除
        elif fun == 3:
            cursor.execute("DELETE FROM project WHERE id = '%d'" % int(id))
            db.commit()
        else :
            raise tornado.web.HTTPError(404)

class FavorHandler(tornado.web.RequestHandler):
    def get(self):
        id = self.get_argument("id")
        cursor.execute("SELECT favor FROM project WHERE project_id =%d" % int(id))
        favor = cursor.fetchall()
        favor = favor[0][0] +1
        cursor.execute("UPDATE project SET favor='%d' WHERE project_id=%d" % (int(favor),int(id)))
        db.commit()

def main():
    tornado.options.parse_command_line()
    http_server = tornado.httpserver.HTTPServer(Application())
    http_server.listen(options.port)
    tornado.ioloop.IOLoop.instance().start()


if __name__ =="__main__":
    main()
