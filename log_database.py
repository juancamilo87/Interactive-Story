from datetime import datetime
import time, sqlite3, sys, re, os, uuid
#Default path for our story logs
DEFAULT_DB_PATH = 'log.db' 

class Log(object):
    '''
    API for log
    '''
    
    def __init__(self, db_path=None):
        '''
        db_path is the address of the path passed by calling script.
        If db_path is None, then DEFAULT_DB_PATH is used.
        '''
        super(Log, self).__init__()
        if db_path is not None:
            self.db_path = db_path
        else:
            self.db_path = DEFAULT_DB_PATH
           
    def createTable(self):
        '''
        Create the logTable programmatically 
        Print an error message in the console if it could not be created.
        '''
        stmnt = 'CREATE TABLE logTable(logID INTEGER PRIMARY KEY AUTOINCREMENT,\
                                        logType TEXT,\
                                        logValue TEXT,\
                                        logTime TEXT)'
        con = sqlite3.connect(self.db_path)
        with con:
            cur = con.cursor()
            try:
                cur.execute(stmnt)
            except sqlite3.Error, excp:
                print "Error %s:" % excp.args[0]
        return None
        
    def insertLog(self, logType, logValue):
        '''
        insert one log item 
        Input:
            -logType: we have four types of log which are "start story", "interaction success", "interaction failure", "errors"
                        you should specify the type of log
            -logValue: this is the message for logs
        Output:
            -None: if insert one item failed
            -logID: logID of the inserted log
        '''
        #Validate type
        if logType != "start story" || \
           logType != "interaction success" || \
           logType != "interaction failure" || \
           logType != "errors" :
            raise ValueError("type of log is not correct!")
        
        stmnt = 'INSERT INTO logTable(logType, logValue, logTime) VALUES(?, ?, ?)'
        con = sqlite3.connect(self.db_path)
        with con:
            con.row_factory = sqlite3.Row
            cur = con.cursor()
            logTime = (datetime.now()).strftime("%Y-%m-%d %H-%M-%S")
            pvalue = (logType, logValue, logTime)
            cur.execute(stmnt, con)
            #check whether insert succeed
            if cur.rowcount < 1:
                return None
            else:
                return cur.lastrowid
                
    def readLog(self, logType)
        '''
        read one item from logTable
        Input:
            -logType: the type of log
        Output:
            -all the information of items whose type is logType in logTable
        '''
        #Validate type
        if logType != "start story" || \
           logType != "interaction success" || \
           logType != "interaction failure" || \
           logType != "errors" :
            raise ValueError("type of log is not correct!")
        
        stmnt = 'select * from logTable where logType = ?'
        con = sqlite3.connect(self.db_path)
        with con:
            con.row_factory = sqlite3.Row
            cur = con.cursor()
            pvalue = (logType,)
            cur.execute(stmnt,pvalue)
            #Get result
            rows = row.fetchall()
            if rows is None:
                return None
            #Build the return object
            logs = []
            for row in rows
                log = {'logID': row['logID'], 'logValue': row['logValue'], 'logTime': row['logTime']}
                logs.append(log)
            return logs