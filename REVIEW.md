# DIWA Variable Dictionary — Review Report

**Date:** 2026-03-23

---

## 1. Issues Found & Fixed

### 1.1 Notebook Filename Mismatches (Strategy 2 & Strategy 4) — NOT FIXED (by design)

Three `notebook` values in `variables.json` do not match the actual filenames in the `CBS code files/` folder. The `_CBS_safe` suffix on disk reflects the versions approved for export from CBS servers; the dictionary intentionally uses the original notebook names.

| JSON Value | Actual File on Disk | Affected Variables |
|---|---|---|
| `compute_income_variables.ipynb` | `compute_income_varialbes_CBS_safe.ipynb` | All 14 Strategy 2 variables |
| `strategy_4_creates_variables_1.ipynb` | `strategy_4_creates_variables_1_CBS_safe.ipynb` | 10 Strategy 4 variables |
| `strategy_4_creates_variables_2.ipynb` | `strategy_4_creates_variables_2_CBS_safe.ipynb` | 6 Strategy 4 variables |

---

### 1.2 Strategy 2 — Code & Input Discrepancies — FIXED

#### `other_wage_s2` — Missing `fillna(0)` in code field
- Added the `fillna(0)` operation that was present in the notebook but missing from the dictionary code.

#### `property_income_s2` — Code was only a comment; inputs used raw CBS names
- Replaced comment with actual Python code from notebook.
- Updated inputs from `["HahnasaHonitAheret", "HahnasaLeLoYilshit"]` to `["dividends_s2", "Hahnasa_lelo_yishit"]` to match the renamed variables used in the code.
- Updated logic description accordingly.

#### `selfowned_income_s2` — Code was only a comment
- Replaced comment with actual rename, merge, and fillna code from notebook.
- Updated logic to accurately describe the rename-and-merge process.
- Removed `SugTikShatMas` from inputs (not used in the notebook code).

#### `tax_report` — Inputs listed raw CBS names instead of renamed variables
- Updated inputs from original CBS column names to the renamed variables used in the code: `business_income_s2`, `other_wage_s2`, `capital_gains_s2`, `dividends_s2`, `Hahnasa_lelo_yishit`, `Hahnasat_nehe`, `Hahnasat_ptura`, `selfowned_income_s2`.
- Updated logic to clarify the condition is "non-zero and non-missing" (not just "greater than 0") and that wages_s2 is excluded.
- Added actual Python code from notebook (was only a comment).
- Updated source to `"tbl_hahnsotpratt87_21, tbl_source"` since `selfowned_income_s2` comes from tbl_source.

---

### 1.3 Strategy 3 — Logic Description Error — FIXED

#### `capital_income_r2_s3`
- Logic text said "Sum of property_income_r1_s3 and **profits_attributed_income_s3**" but the code and inputs use **property_attributed_income_s3**.
- Fixed to: "Sum of property_income_r1_s3 and property_attributed_income_s3."

---

### 1.4 Strategy 3 — Minor Code Style Differences — NOT FIXED (acceptable)

#### `benefits_allocated_s3` and `benefits_allocated_r1_s3`
- Code in JSON uses `filtered_df` as the variable name; the notebook uses `filtered_wage_df`.
- Functionally equivalent; kept as-is for readability.

#### `property_attributed_income_s3`
- Code in JSON is a cleaned-up/refactored version of the notebook function. Functionally equivalent.

---

### 1.5 Social Groups — Bug in Notebook Code — FIXED (in dictionary)

#### `secondhgash` — Ashkenazi mother condition used wrong continents
- Code had: `ashkenazi_mother = (Tbl_x2022['EretzLeidaEm'].isin(['Africa', 'Asia']))`.
- Fixed to: `ashkenazi_mother = (Tbl_x2022['EretzLeidaEm'].isin(['Europe', 'America']))`.
- **Note:** This bug exists in the **source notebook** itself (`Tbl_x2022_compute_social_groups_var_fixed_CBS_safe.ipynb`). The dictionary now has the corrected version, but the notebook file should also be updated separately.

---

## 2. App Functionality Review

### 2.1 Cross-Strategy Navigation — Working
The `navigatingToVar` ref pattern correctly prevents the `useEffect` from clearing `selectedVar` when clicking an input pill that links to a variable in another strategy.

### 2.2 Type Colors — Complete
All 11 unique `type` values in `variables.json` are covered in `TYPE_COLORS`:
wage, capital, benefits, demographics, wage/capital, class, generation, ethnicity, premium, education, geography.

### 2.3 Source Descriptions — Complete
All unique `source` values are covered in `SOURCE_DESCRIPTIONS`.

### 2.4 JSON Structure — Valid
All variables have required fields (`name`, `definition`, `type`, `source`, `logic`). Optional fields (`notebook`, `inputs`, `code`, `tag`) are handled correctly.

### 2.5 Search & Filter — Working
- Case-insensitive search on `name` and `definition`.
- Type filter requires exact match (by design — "wage" filter does not show "wage, capital" variables).

---

## 3. Improvement Ideas

### High Value
1. **"Used by" section** — Show which other variables depend on the currently selected variable (reverse dependency view).
2. **Cross-strategy search** — Option to search across all strategies at once.
3. **Notebook filename links** — If notebook files are accessible, make the notebook label clickable to open the file.

### Medium Value
4. **Navigation breadcrumb** — Show path when navigating across strategies (e.g., "Strategy 3 > property_attributed_income_s3 > wages_s2 (Strategy 2)").
5. **Search highlight** — Highlight matching terms in the variable list results.
6. **Export** — Copy variable definition or export filtered list as CSV/JSON.

### Lower Priority
7. **Keyboard navigation** — Arrow keys to move through variable list, Enter to select.
8. **Accessibility** — Add `aria-label` attributes to interactive elements (input pills, filter buttons).
9. **Compound type filter** — Optionally include "wage, capital" when filtering by "wage" or "capital".

---

## 4. Summary

| Category | Status |
|---|---|
| Strategy 2 variables | 4 issues fixed (`other_wage_s2`, `property_income_s2`, `selfowned_income_s2`, `tax_report`) |
| Strategy 3 variables | 1 issue fixed (`capital_income_r2_s3` logic text) |
| Strategy 4 variables | Notebook filenames kept as-is (by design) |
| Production Classes | All correct |
| Social Groups | 1 bug fixed in dictionary (`secondhgash`); source notebook still has the bug |
| App functionality | Working correctly |
| Type/Source coverage | 100% complete |
