import {Skeleton} from "@mantine/core";

export default function LoadingTable() {
  return (
      <div className={"m-10"}>
          <div style={{display: "flex", flexDirection: "column", alignItems: "stretch"}}>
              {/* Small box at top-left corner */}
              <div style={{alignSelf: "flex-start", marginBottom: "20px"}}>
                  <Skeleton width="50px" height="50px"/>
              </div>

              {/* Faux table in the middle */}
              <div style={{width: "100%"}}>
                  {/* Table Header */}
                  <div style={{display: "flex", marginBottom: "10px"}}>
                      <Skeleton width="calc(100% * 0.3)" height="20px" style={{marginRight: "10px"}}/>
                      <Skeleton width="calc(100% * 0.2)" height="20px" style={{marginRight: "10px"}}/>
                      <Skeleton width="calc(100% * 0.2)" height="20px" style={{marginRight: "10px"}}/>
                      <Skeleton width="calc(100% * 0.1)" height="20px" style={{marginRight: "10px"}}/>
                      <Skeleton width="calc(100% * 0.2)" height="20px" style={{marginRight: "10px"}}/>
                  </div>

                  {/* Table Rows */}
                  {[1, 2, 3].map((row, index) => (
                      <div key={index} style={{display: "flex", marginBottom: "10px"}}>
                          <Skeleton width="calc(100% * 0.3)" height="20px" style={{marginRight: "10px"}}/>
                          <Skeleton width="calc(100% * 0.2)" height="20px" style={{marginRight: "10px"}}/>
                          <Skeleton width="calc(100% * 0.2)" height="20px" style={{marginRight: "10px"}}/>
                          <Skeleton width="calc(100% * 0.1)" height="20px" style={{marginRight: "10px"}}/>
                          <Skeleton width="calc(100% * 0.2)" height="20px" style={{marginRight: "10px"}}/>
                      </div>
                  ))}
              </div>
          </div>
      </div>
  );
}
