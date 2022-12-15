import http from '@/utils/http';
import moment from 'moment';

export default {
	findMaxMinByListId(listId) {
		return http.request('/gql', {
			query: `query{
        CalculoRisco_aggregate(functions:[
          "Min(LC)","Max(LC)","Min(LS)","Max(LS)","Min(EG)","Max(EG)","Min(CE)","Max(CE)","Min(ALDB)",
          "Max(ALDB)","Min(ALDL)","Max(ALDL)","Min(AL)","Max(AL)","Min(ICJ)","Max(ICJ)","Min(ROE)",
          "Max(ROE)","Min(ME)","Max(ME)","Min(ML)","Max(ML)","Min(GA)","Max(GA)"] groupBy:"Data.Year" 
          where:"EmpresaId in (${listId})") {
          Group
          Value
        }
      }`
		});
	}
};
